import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getERC20Balance,
  getERC20BalanceFromProvider,
  getTotalSupplyAWRPSlaveView,
  getERC20Allowance,
  approveERC20,
  depositUSDC,
} from "@/components/metamask/Metamask";
import {
  addressSlaveTestnet,
  sepoliaMaster,
} from "@/data/contractTestnetAddresses";
import { useMetaMask } from "metamask-react";
import { sepoliaProviderAlchemyUrl } from "@/data/providers";
import Loading from "@/components/Common/Loading";
import { explorersTestnet, cahinLinkCCIP } from "@/data/explorers";

const DepositModal = ({ depositModal, setDepositModal, vaultBalance }) => {
  const activeNodeChain = "arbitrum";
  const [depositUsdc, setDepositUsdc] = useState(0);
  const [usdcUserBalance, setUsdcUserBalance] = useState(0);
  const [AWRPUserBalance, setAWRPUserBalance] = useState(0);
  const [AWRPTotalSupply, setAWRPTotalSupply] = useState(0);
  const [usdcAllowance, setUsdcAllowance] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const [isDepositTx, setIsDepositTx] = useState(false);

  const [isSendingTx, setIsSendingTx] = useState(false);

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const handleInput = (e) => {
    let value = e.target.value;
    if (e.target.value < 0) {
      value = 0;
    }
    if (e.target.value >= parseFloat(usdcUserBalance / 10 ** 6)) {
      value = parseFloat(usdcUserBalance / 10 ** 6);
    }

    setDepositUsdc(value);
  };

  const handleApprove = async () => {
    try {
      setIsDepositTx(false);
      setTxHash(null);
      setIsSendingTx(true);
      const tx = await approveERC20(
        addressSlaveTestnet[activeNodeChain].usdc,
        addressSlaveTestnet[activeNodeChain].slave,
        depositUsdc,
        10 ** 6,
      );
      if (tx && tx.wait) {
        setTxHash(tx);
        await tx.wait();
        const response = await getERC20Allowance(
          addressSlaveTestnet[activeNodeChain].usdc,
          account,
          addressSlaveTestnet[activeNodeChain].slave,
        );
        setUsdcAllowance(response);
      }
    } catch (error) {
      console.error("Error approving USDC:", error);
    } finally {
      setIsSendingTx(false);
    }
  };

  const handleDeposit = async () => {
    try {
      setIsDepositTx(true);
      setTxHash(null);
      setIsSendingTx(true);
      const tx = await depositUSDC(
        addressSlaveTestnet[activeNodeChain].slave,
        depositUsdc,
      );
      if (tx && tx.wait) {
        setTxHash(tx);
        await tx.wait();
        const responseAllowance = await getERC20Allowance(
          addressSlaveTestnet[activeNodeChain].usdc,
          account,
          addressSlaveTestnet[activeNodeChain].slave,
        );
        setUsdcAllowance(responseAllowance);
        const responseBalanceUsdc = await getERC20Balance(
          addressSlaveTestnet[activeNodeChain].usdc,
          account,
        );
        setUsdcUserBalance(responseBalanceUsdc);
      }
    } catch (error) {
      console.error("Error depositing USDC:", error);
    } finally {
      setIsSendingTx(false);
    }
  };

  const calculateAWRPReceived = () => {
    const shares = (depositUsdc * AWRPTotalSupply) / vaultBalance;
    return shares / 10 ** 12;
  };

  useEffect(() => {
    if (account) {
      getERC20Balance(addressSlaveTestnet[activeNodeChain].usdc, account).then(
        (response) => setUsdcUserBalance(response),
      );
      getTotalSupplyAWRPSlaveView(
        addressSlaveTestnet[activeNodeChain].slave,
      ).then((response) => {
        setAWRPTotalSupply(response);
      });
      getERC20BalanceFromProvider(
        sepoliaMaster,
        sepoliaProviderAlchemyUrl,
        account,
      ).then((response) => {
        setAWRPUserBalance(response);
      });
      getERC20Allowance(
        addressSlaveTestnet[activeNodeChain].usdc,
        account,
        addressSlaveTestnet[activeNodeChain].slave,
      ).then((response) => setUsdcAllowance(response));
    }
  }, [account]);

  return (
    depositModal && (
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
                    Deposit USDC On{" "}
                    {activeNodeChain.charAt(0).toUpperCase() +
                      activeNodeChain.slice(1)}
                    <span>
                      <Image
                        src={`/images/${activeNodeChain}.svg`}
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
                onClick={() => setDepositModal(false)}
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
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
                    <label
                      for="name"
                      className="mb-2 ml-1 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select Deposit Amount
                    </label>
                    <button
                      onClick={() =>
                        setDepositUsdc(parseFloat(usdcUserBalance / 10 ** 6))
                      }
                      for="name"
                      className=" flex items-center text-xs font-medium text-blue-700 dark:text-blue-500"
                    >
                      Balance {parseFloat(usdcUserBalance / 10 ** 6).toFixed(2)}
                      <span>
                        <Image
                          src={`/images/usdc.svg`}
                          alt="usdcIcon"
                          height={13}
                          width={13}
                          className="ml-1 "
                        />
                      </span>{" "}
                      <span className="ml-1 text-blue-700 dark:text-blue-500">
                        USDC
                      </span>
                    </button>
                  </div>
                  <input
                    onChange={(e) => handleInput(e)}
                    value={depositUsdc}
                    type="number"
                    name="tokens"
                    id="name"
                    className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="Insert Tokens To Buy"
                    required=""
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    className="mb-2  ml-1 flex text-xs font-medium text-gray-900 dark:text-white"
                  >
                    You Will Get aWRP On{" "}
                    <span>
                      <Image
                        src={`/images/ethereum.svg`}
                        alt="usdcIcon"
                        height={10}
                        width={10}
                        className="ml-1 "
                      />
                    </span>{" "}
                  </label>
                  <div className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400">
                    {calculateAWRPReceived().toFixed(15) == 0
                      ? 0
                      : calculateAWRPReceived().toFixed(15)}
                  </div>
                  <div className=" ml-1 mt-1 text-xs">
                    Balance: {parseFloat(AWRPUserBalance / 10 ** 18).toFixed(2)}
                    <span className="ml-1 text-violet-800 dark:text-violet-500">
                      aWRP
                    </span>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    className="mb-2 ml-1 block text-xs font-medium text-gray-900 dark:text-white"
                  >
                    You Will Deposit
                  </label>
                  <div className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400">
                    {depositUsdc}{" "}
                    <span className="text-[10px] text-blue-700 dark:text-blue-400">
                      USDC
                    </span>
                  </div>

                  <div className="ml-1 mt-1 flex text-xs ">
                    Allowed:{" "}
                    <span className="ml-1 text-blue-700 dark:text-blue-500">
                      {usdcAllowance / 10 ** 6}
                    </span>{" "}
                    <span>
                      <Image
                        src={`/images/usdc.svg`}
                        alt="usdcIcon"
                        height={13}
                        width={13}
                        className="mx-1 "
                      />
                    </span>{" "}
                    <span className="text-blue-700 dark:text-blue-500">
                      USDC
                    </span>
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
                    Once you make the deposit, your USDC will automatically
                    start generating yield. However, you will not be able to see
                    your aWRP balance updated until your new deposit is
                    propagated to the MASTER contract on the Sepolia network.
                    This usually take about 20 minutes.
                  </div>
                </div>
              </div>
              {usdcAllowance < depositUsdc * 10 ** 6 ? (
                <button
                  onClick={() => handleApprove()}
                  className={`  
                 " w-40 items-center rounded-[4px] bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 
                 dark:focus:ring-blue-800
                `}
                >
                  {!isSendingTx ? "Approve USDC" : <Loading />}
                </button>
              ) : (
                <button
                  onClick={() => handleDeposit()}
                  className={`  
                   " w-40 items-center rounded-[4px] bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 
                   dark:focus:ring-blue-800
                  `}
                >
                  {!isSendingTx ? "Deposit USDC" : <Loading />}
                </button>
              )}

              {txHash && (
                <>
                  <div className="mt-4 flex items-center">
                    <div className="flex-grow border-b border-gray-300"></div>
                  </div>
                  <div className="mt-2 flex justify-center text-sm">
                    <Image
                      src={`/images/${activeNodeChain}.svg`}
                      alt="usdcIcon"
                      height={20}
                      width={20}
                      className="-mt-1 mr-1 "
                    />
                    Transaction Hash
                  </div>

                  <div className="mt-1 flex justify-center text-sm">
                    <Link
                      href={`${explorersTestnet[activeNodeChain].explorer}tx/${txHash.hash}`}
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
              {isDepositTx && txHash && (
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
                      href={`${cahinLinkCCIP}${txHash.hash}`}
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
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DepositModal;
