import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getERC20Balance,
  getERC20BalanceFromProvider,
  getTotalSupplyAWRPFromProvider,
  withdrawUsdc,
  getLinkFeesWithdraw,
  getERC20Allowance,
  approveERC20,
} from "@/components/metamask/Metamask";

import { dataContracts, cahinLinkCCIPExplorer } from "@/data/dataContracts";
import Loading from "../Common/Loading";
import { LuRefreshCw } from "react-icons/lu";
import { IoInformationCircleOutline } from "react-icons/io5";
import { saveTxHashByType } from "@/utils/utilFuncs";

const WithdrawModal = ({
  withdrawModal,
  setWithrawModal,
  userChainId,
  activeNodeChainId,
  masterChainId,
  account,
}) => {
  const [vaultBalance, setVaultBalance] = useState(0);
  const [AWRPUserBalance, setAWRPUserBalance] = useState(0);
  const [linkFeeRequired, setLinkFeeRequired] = useState(0);
  const [linkAllowance, setLinkAllowance] = useState(0);
  const [AWRPTotalSupply, setAWRPTotalSupply] = useState(0);
  const [burnAWRP, setBurnAWRP] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const [txHashApprove, setTxHashApprove] = useState(null);
  const [isSendingTx, setIsSendingTx] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSendingLinkApproval, setIsSendingLinkAproval] = useState(false);
  const [isDepositTx, setIsDepositTx] = useState(false);

  const masterNodeSameThanActiveNode = masterChainId == activeNodeChainId;

  const handleInput = (e) => {
    let value = e.target.value;
    if (e.target.value < 0) {
      value = 0;
    }
    if (e.target.value >= parseFloat(AWRPUserBalance / 10 ** 18)) {
      value = parseFloat(AWRPUserBalance / 10 ** 18);
    }

    setBurnAWRP(value);
  };

  const calculateUsdcReceived = () => {
    const amount =
      (burnAWRP * 10 ** 18 * 10 ** 18 * vaultBalance) / AWRPTotalSupply;

    return amount / 10 ** 18;
  };

  const getCurrentLinkFees = () => {
    getLinkFeesWithdraw(account, activeNodeChainId).then((response) => {
      setLinkFeeRequired(response);
    });
  };
  const handleApproveLink = async () => {
    try {
      setIsDepositTx(false);
      setTxHashApprove(null);
      setTxHash(null);
      setIsSendingLinkAproval(true);
      const tx = await approveERC20(
        dataContracts[masterChainId].link,
        dataContracts[masterChainId].master,
        linkFeeRequired * 2,
        1,
      );
      if (tx && tx.wait) {
        setTxHashApprove(tx);
        await tx.wait();
        const response = await getERC20Allowance(
          dataContracts[masterChainId].link,
          account,
          dataContracts[masterChainId].master,
        );
        setLinkAllowance(response);
      }
    } catch (error) {
      console.error("Error approving USDC:", error);
    } finally {
      setIsSendingLinkAproval(false);
    }
  };

  useEffect(() => {
    if (account) {
      getERC20Balance(dataContracts[userChainId].master, account).then(
        (response) => {
          setAWRPUserBalance(response);
        },
      );
      getERC20BalanceFromProvider(
        dataContracts[activeNodeChainId].ausdc,
        dataContracts[activeNodeChainId].provider.alchemy,
        dataContracts[activeNodeChainId].node,
      ).then((response) => {
        setVaultBalance(response);
      });
      getTotalSupplyAWRPFromProvider(
        dataContracts[activeNodeChainId].node,
        dataContracts[activeNodeChainId].provider.alchemy,
      ).then((response) => {
        setAWRPTotalSupply(response);
      });
      if (!masterNodeSameThanActiveNode) {
        getCurrentLinkFees();
      }
      getERC20Allowance(
        dataContracts[masterChainId].link,
        account,
        dataContracts[masterChainId].master,
      ).then((response) => setLinkAllowance(response));
    }
  }, [account]);

  const handleWithdraw = async () => {
    try {
      setIsSendingTx(true);
      setTxHash(null);
      setTxHashApprove(null);
      const tx = await withdrawUsdc(burnAWRP);
      if (tx && tx.wait) {
        setTxHash(tx);
        saveTxHashByType(
          tx.hash,
          "withdraw",
          masterChainId,
          activeNodeChainId,
          account,
        );
        await tx.wait();

        const responseBalanceAwrp = await getERC20Balance(
          dataContracts[userChainId].master,
          account,
        );
        setAWRPUserBalance(responseBalanceAwrp);

        const response = await getERC20Allowance(
          dataContracts[masterChainId].link,
          account,
          dataContracts[masterChainId].master,
        );
        setLinkAllowance(response);
      }
    } catch (error) {
      console.error("Error withdrawing USDC:", error);
    } finally {
      setIsSendingTx(false);
    }
  };

  return (
    withdrawModal && (
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="fixed left-1/2 top-1/2 z-50 max-h-full w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto overflow-x-hidden p-4"
      >
        <div className="relative max-h-full w-full max-w-md p-4">
          <div className="relative rounded-lg bg-[#d5ecf5] shadow-md dark:bg-slate-900 dark:shadow-gray-800">
            <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
              <div>
                <div className="flex items-center">
                  <h3 className="flex text-lg font-semibold text-gray-900 dark:text-white">
                    Withdraw USDC from{" "}
                    {dataContracts[masterChainId].formatedName}
                    <span>
                      <Image
                        src={dataContracts[masterChainId].icon}
                        alt="usdcIcon"
                        height={25}
                        width={25}
                        className="ml-1 mt-0.5"
                      />
                    </span>{" "}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setWithrawModal(false)}
                type="button"
                className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-blue-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
              >
                <svg
                  className="h-3 w-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5">
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="flex justify-between">
                    <label className="mb-2 ml-1 block text-sm font-medium text-gray-900 dark:text-white">
                      Select Withdraw Amount
                    </label>
                    <button
                      onClick={() =>
                        setBurnAWRP(parseFloat(AWRPUserBalance / 10 ** 18))
                      }
                      className=" mr-1 flex items-center text-xs font-medium text-violet-500"
                    >
                      Balance{" "}
                      {parseFloat(AWRPUserBalance / 10 ** 18).toFixed(2)}
                      <span></span> <span className="ml-1">aWRP</span>
                    </button>
                  </div>
                  <input
                    onChange={(e) => handleInput(e)}
                    value={burnAWRP}
                    type="number"
                    name="tokens"
                    id="name"
                    className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Insert Tokens To Buy"
                    required=""
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="mb-2 ml-1 flex text-xs font-medium text-gray-900 dark:text-white">
                    You Will Get On Chain{" "}
                    <span>
                      <Image
                        src={dataContracts[activeNodeChainId].icon}
                        alt="activeNode"
                        height={17}
                        width={17}
                        className="-mt-0.5 ml-1"
                      />
                    </span>{" "}
                  </label>
                  <div className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500  dark:test-blue-300 flex w-full justify-between rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-xs text-blue-700  dark:border-gray-500  dark:bg-gray-600 dark:text-blue-400  dark:placeholder-gray-400">
                    {(calculateUsdcReceived() / 10 ** 6).toFixed(6)}{" "}
                    <div className="flex">
                      <span>
                        <Image
                          src={`/images/usdc.svg`}
                          alt="activeNode"
                          height={13}
                          width={13}
                          className="mr-1 "
                        />
                      </span>{" "}
                      USDC
                    </div>
                  </div>
                </div>
                {/* do not delete this line */}
                <div className="col-span-2 sm:col-span-1"></div>
                {!masterNodeSameThanActiveNode ? (
                  <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1 ml-1 block text-xs font-medium text-gray-900 dark:text-white">
                      Current Fee For Deposit
                    </label>
                    <div
                      className={` focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500  flex w-full justify-between rounded-lg border   ${linkFeeRequired > linkAllowance ? "border-red" : "border-gray-300"} bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400   `}
                    >
                      <div
                        className={`${refreshing && " animate-bounce opacity-50"}`}
                      >
                        {parseFloat(linkFeeRequired / 10 ** 18).toFixed(5)}{" "}
                        <span className="text-[10px]">LINK</span>
                      </div>

                      <button
                        onClick={() => {
                          setRefreshing(true);
                          getCurrentLinkFees();

                          // Agrega un retardo de 1 segundo antes de cambiar refreshing a false
                          setTimeout(() => {
                            setRefreshing(false);
                          }, 1000); // 1000 milisegundos = 1 segundo
                        }}
                      >
                        <LuRefreshCw
                          className={`transform transition duration-300 ease-in-out hover:rotate-180 focus:opacity-50`}
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-2 sm:col-span-1">
                    <div className=" ml-1 mt-5 text-xs font-medium text-gray-900 dark:text-white">
                      Master And Node In Same Chain No Link Required
                    </div>
                  </div>
                )}

                <div
                  className={`col-span-2 sm:col-span-1 ${masterNodeSameThanActiveNode && "opacity-50"}`}
                >
                  <button
                    disabled={masterNodeSameThanActiveNode}
                    onClick={() => handleApproveLink()}
                    className={`  
                   " mt-6 w-40 items-center rounded-[4px] bg-blue-700 px-3 py-1.5 text-center text-xs font-medium text-white ${!masterNodeSameThanActiveNode && "hover:bg-blue-800"}  focus:outline-none focus:ring-4 focus:ring-blue-300 
                   dark:bg-blue-600 dark:hover:bg-blue-700
                   dark:focus:ring-blue-800 
                  `}
                  >
                    {isSendingLinkApproval ? (
                      <Loading />
                    ) : (
                      <div className="flex justify-center">
                        Approve Some Link{" "}
                        <span>
                          <IoInformationCircleOutline
                            size={15}
                            className="ml-1"
                          />
                        </span>{" "}
                      </div>
                    )}
                  </button>
                  <div className="ml-1 mt-1 flex text-xs ">
                    Allowed:{" "}
                    <span className="ml-1 ">
                      {(linkAllowance / 10 ** 18).toFixed(5)}
                    </span>{" "}
                    <span>
                      <Image
                        src={`/images/link.svg`}
                        alt="usdcIcon"
                        height={13}
                        width={13}
                        className="mx-1 "
                      />
                    </span>{" "}
                    <span className="">LINK</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="mb-2 ml-1 block text-sm font-medium text-gray-900 dark:text-white">
                    Important Information
                  </label>
                  <div
                    id="description"
                    className="block h-[150px] w-full overflow-auto rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  >
                    Why do I need to connect to{" "}
                    {dataContracts[masterChainId].formatedName} to make a
                    withdrawal? <br />
                    User balances are stored in the MASTER CONTRACT located in
                    {dataContracts[masterChainId].formatedName}. Once you give
                    the withdrawal order, it will propagate to where the vault
                    is located at that moment, the withdrawal will be made, and
                    your funds will remain on that blockchain.
                    <br /> The propagation of the withdrawal order usually takes
                    about 20 minutes to complete.
                  </div>
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={() => handleWithdraw()}
                  disabled={linkFeeRequired > linkAllowance}
                  className={`  
                 " w-40 items-center rounded-[4px] bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white  focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600  
                 dark:focus:ring-blue-800 ${linkFeeRequired > linkAllowance ? "opacity-50" : "hover:bg-blue-800 dark:hover:bg-blue-700"}
                `}
                >
                  {isSendingTx ? <Loading /> : "Withdraw"}
                </button>
                {linkFeeRequired > linkAllowance && (
                  <div className="ml-5 flex items-center justify-center text-xs text-red">
                    Approve some Link first
                  </div>
                )}
              </div>

              <div>
                {txHashApprove && (
                  <>
                    <div className="mt-4 flex items-center">
                      <div className="flex-grow border-b border-gray-300"></div>
                    </div>
                    <div className="mt-2 flex justify-center text-sm">
                      <Image
                        src={dataContracts[masterChainId].icon}
                        alt="usdcIcon"
                        height={20}
                        width={20}
                        className="-mt-1 mr-1 "
                      />

                      {dataContracts[masterChainId].formatedName}
                    </div>

                    <div className="mt-1 flex justify-center text-sm">
                      <Link
                        href={`${dataContracts[masterChainId].explorer}${txHashApprove.hash}`}
                        target="_blank"
                      >
                        <span className="hover:text-violet-500">{`${txHashApprove.hash.slice(
                          0,
                          15,
                        )}...${txHashApprove.hash.slice(-15)}`}</span>
                      </Link>
                    </div>
                  </>
                )}
                {txHash && !masterNodeSameThanActiveNode && (
                  <>
                    <div className="mt-4 flex items-center">
                      <div className="flex-grow border-b border-gray-300"></div>
                    </div>
                    <div className="mt-2 flex justify-center text-sm">
                      <Image
                        src={`/images/link.svg`}
                        alt="usdcIcon"
                        height={20}
                        width={20}
                        className="-mt-1 mr-1 "
                      />
                      Propagation to MASTER CONTRACT
                    </div>

                    <div className="mt-1 flex justify-center text-sm">
                      <Link
                        href={`${cahinLinkCCIPExplorer}${txHash.hash}`}
                        target="_blank"
                      >
                        <span className="hover:text-violet-500">{`${txHash.hash.slice(
                          0,
                          15,
                        )}...${txHash.hash.slice(-15)}`}</span>
                      </Link>
                    </div>
                  </>
                )}
                {txHash && masterNodeSameThanActiveNode && (
                  <>
                    <div className="mt-4 flex items-center">
                      <div className="flex-grow border-b border-gray-300"></div>
                    </div>
                    <div className="mt-2 flex justify-center text-sm">
                      <Image
                        src={dataContracts[activeNodeChainId].icon}
                        alt="usdcIcon"
                        height={20}
                        width={20}
                        className="-mt-1 mr-1 "
                      />
                      Transaction Hash
                    </div>

                    <div className="mt-1 flex justify-center text-sm">
                      <Link
                        href={`${dataContracts[activeNodeChainId].explorer}tx/${isDepositTx.hash}`}
                        target="_blank"
                      >
                        <span className="hover:text-violet-500">{`${isDepositTx.hash.slice(
                          0,
                          15,
                        )}...${isDepositTx.hash.slice(-15)}`}</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default WithdrawModal;
