"use client";

import Image from "next/image";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { IoInformationCircleOutline } from "react-icons/io5";

import { FaArrowRight } from "react-icons/fa";

import {
  dataContracts,
  masterChainId,
  getChainIdByChainIdCCIP,
} from "@/data/dataContracts";
import {
  getLastTimeWarped,
  getIsWarpingNodeFromProvider,
  getActiveNodeChainIdCCIP,
  getERC20BalanceFromProvider,
  getAvaliableToWithdrawFromProvider,
  switchNetwork,
  getNodeAaveSupplyRate,
} from "@/components/metamask/Metamask";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import DepositModal from "@/components/modals/DepositModal";
import WithdrawModal from "@/components/modals/WithdrawModal";
import { useMetaMask } from "metamask-react";
import { humanReadableDateFromTimestamp } from "@/utils/utilFuncs";
import Loading from "../Common/Loading";

const Dashboard = () => {
  const [activeNodeChainId, setActiveNodeChainId] = useState(null);

  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [vaultBalance, setVaultBalance] = useState(0);
  const [lastTimeWarped, setLastTimeWarped] = useState(0);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [usdcUserBalance, setUsdcUserBalance] = useState(0);
  const [AWRPUserBalance, setAWRPUserBalance] = useState(0);
  const [supplyRate, setSupplyRate] = useState(0);
  const [avaliableToWithdraw, setAvaliableToWithdraw] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [isVaultBalanceLoaded, setIsVaultBalanceLoaded] = useState(false);
  const [loadingAwrp, setLoadingAwrp] = useState(true);
  const [loadingAvl, setLoadingAvl] = useState(true);

  const userChainId = chainId && parseInt(chainId, 16);

  const isWarpingFromActiveNode = isVaultBalanceLoaded && vaultBalance == 0;

  const RAY = 10 ** 27;
  const SECONDS_PER_YEAR = 31536000;

  useEffect(() => {
    if (activeNodeChainId) {
      getIsWarpingNodeFromProvider().then((response) => setIsWarping(response));
    }
  }, [activeNodeChainId]);

  useEffect(() => {
    getActiveNodeChainIdCCIP(
      dataContracts[masterChainId].master,
      dataContracts[masterChainId].provider.alchemy,
    ).then((response) => {
      const chainId = getChainIdByChainIdCCIP(parseInt(response));
      setActiveNodeChainId(parseInt(chainId));
    });
    getLastTimeWarped().then((response) => setLastTimeWarped(response));
  }, []);
  useEffect(() => {
    if (activeNodeChainId) {
      getERC20BalanceFromProvider(
        dataContracts[activeNodeChainId].ausdc,
        dataContracts[activeNodeChainId].provider.alchemy,
        dataContracts[activeNodeChainId].node,
      ).then((response) => {
        setVaultBalance(response);
        setIsVaultBalanceLoaded(true);
      });
      getNodeAaveSupplyRate(activeNodeChainId).then((response) => {
        const apr = parseInt(response) / RAY;
        const depositAPY =
          Math.pow(1 + apr / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
        setSupplyRate(depositAPY);
      });
    }
  }, [activeNodeChainId]);

  useEffect(() => {
    if (account && activeNodeChainId && vaultBalance) {
      getERC20BalanceFromProvider(
        dataContracts[activeNodeChainId].usdc,
        dataContracts[activeNodeChainId].provider.alchemy,
        account,
      ).then((response) => {
        setUsdcUserBalance(response);
      });

      getERC20BalanceFromProvider(
        dataContracts[masterChainId].master,
        dataContracts[masterChainId].provider.alchemy,
        account,
      ).then((response) => {
        setAWRPUserBalance(response);
        setLoadingAwrp(false);

        if (response != 0) {
          getAvaliableToWithdrawFromProvider(
            dataContracts[activeNodeChainId].node,
            dataContracts[activeNodeChainId].provider.alchemy,
            response,
          ).then((response) => {
            setAvaliableToWithdraw(response);
          });
        } else {
          setLoadingAvl(false);
        }
      });
    } else {
      setLoadingAvl(false);
      setLoadingAwrp(false);
    }
  }, [account, activeNodeChainId, vaultBalance]);

  useEffect(() => {
    setDepositModal(false);
    setWithdrawModal(false);
  }, [chainId, activeNodeChainId]);

  console.log(depositModal);
  return (
    <section id="contact" className="relative py-20 md:py-[120px]">
      <div className="absolute left-0 top-0 -z-[1] h-full w-full dark:bg-dark"></div>
      <div className="absolute left-0 top-0 -z-[1] h-1/2 w-full bg-[#E9F9FF] dark:bg-dark-700 lg:h-[45%] xl:h-1/2"></div>
      <div className="container px-4">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div className="ud-contact-content-wrapper">
              <div className="ud-contact-title mb-12 lg:mb-[150px]">
                <span className="mb-6 block text-base font-medium text-dark dark:text-white">
                  DASHBOARD V.05
                </span>
                <h2 className="max-w-[260px] text-[30px] font-semibold leading-[1.14] text-dark dark:text-white">
                  Deposit And Withdraw Assets
                </h2>
                <div className=" mt-5">
                  <p>Master Node Contract Deploy:</p>
                  <div className="flex">
                    <Image
                      src={dataContracts[masterChainId].icon}
                      alt="master_image"
                      height={20}
                      width={20}
                      className="mr-2"
                    />
                    {dataContracts[masterChainId].master}

                    <Link
                      href={`${dataContracts[masterChainId].explorer}/address/${dataContracts[masterChainId].master}`}
                      target="_blank"
                      className="ml-1 text-sm"
                    >
                      <LiaExternalLinkAltSolid
                        className="  cursor-pointer hover:text-blue"
                        size={20}
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="-mt-10 mb-12 flex flex-wrap justify-between lg:mb-0">
                <div className="mb-8 flex w-full max-w-full ">
                  <div className="">
                    <table className="-ml-10 w-full  text-left  text-gray-500 dark:text-gray-400 rtl:text-right">
                      <thead className=" bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-center">
                            Asset
                          </th>
                          <th scope="col" className="px-6 py-3 text-center">
                            aWRP Balance
                          </th>
                          <th scope="col" className="px-6 py-3 text-center">
                            USDC To Withdraw
                          </th>
                          <th scope="col" className=" px-6 py-3 text-center">
                            <div className="flex">Deposit </div>
                          </th>
                          <th scope="col" className=" px-6 py-3 text-center">
                            <div className="flex">Withdraw </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                          <th
                            scope="row"
                            className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                          >
                            <div className="flex ">
                              <span className="">
                                <Image
                                  src={"/images/usdc.svg"}
                                  alt="usdcIcon"
                                  height={25}
                                  width={25}
                                  className=" mr-2 "
                                />
                              </span>{" "}
                            </div>
                          </th>
                          <td className="px-6 py-4 text-center text-sm">
                            {loadingAwrp ? (
                              <Loading />
                            ) : (
                              parseFloat(AWRPUserBalance / 10 ** 18).toFixed(2)
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {loadingAvl ? (
                              <Loading />
                            ) : (
                              parseFloat(avaliableToWithdraw / 10 ** 6).toFixed(
                                6,
                              )
                            )}
                          </td>
                          <td className=" px-6 py-4">
                            <div className="flex justify-center">
                              {activeNodeChainId && (
                                <Image
                                  src={dataContracts[activeNodeChainId].icon}
                                  alt="chainImg"
                                  height={25}
                                  width={25}
                                  className="mr-2"
                                />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <Image
                                src={dataContracts[masterChainId].icon}
                                alt="chainImg"
                                height={25}
                                width={25}
                                className=""
                              />
                              <FaArrowRight className="mx-2 mt-1" />
                              {activeNodeChainId && (
                                <Image
                                  src={dataContracts[activeNodeChainId].icon}
                                  alt="chainImg"
                                  height={25}
                                  width={25}
                                  className=""
                                />
                              )}
                            </div>
                          </td>
                          {activeNodeChainId && (
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <button
                                  disabled={isWarpingFromActiveNode}
                                  onClick={() => {
                                    account
                                      ? chainId != activeNodeChainId
                                        ? switchNetwork(activeNodeChainId)
                                        : setDepositModal(true)
                                      : connect();
                                  }}
                                  className={`inline-flex items-center justify-center rounded-[4px] bg-primary px-3 py-2 text-sm  font-medium text-white transition duration-300 ease-in-out hover:bg-primary/90 ${isWarpingFromActiveNode && "opacity-50"}`}
                                >
                                  Deposit
                                </button>
                                <button
                                  disabled={isWarping}
                                  onClick={() => {
                                    account
                                      ? chainId != masterChainId
                                        ? switchNetwork(masterChainId)
                                        : setWithdrawModal(true)
                                      : connect();
                                  }}
                                  className={`${isWarping && " opacity-50"} ml-2 inline-flex items-center justify-center rounded-[4px] bg-primary px-3 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-primary/90`}
                                >
                                  Withdraw
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <div
              className="wow fadeInUp rounded-lg bg-white px-8 py-10 shadow-testimonial dark:bg-dark-2 dark:shadow-none sm:px-10 sm:py-12 md:p-[60px] lg:p-10 lg:px-10 lg:py-12 2xl:p-[60px]"
              data-wow-delay=".2s
            "
            >
              <h3 className="mb-8 text-2xl font-semibold text-dark dark:text-white md:text-[28px] md:leading-[1.42]">
                Vault Allocation
              </h3>
              <div>
                <div className="mb-[22px]">
                  <div className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    Address And Chain Allocation
                  </div>
                  {activeNodeChainId && (
                    <div className="flex">
                      <Image
                        src={dataContracts[activeNodeChainId].icon}
                        alt="chainImg"
                        height={20}
                        width={20}
                        className="mr-2"
                      />
                      <div className="block pt-1 text-sm text-dark dark:text-white">
                        {`${dataContracts[activeNodeChainId].node.slice(0, 12)}...${dataContracts[
                          activeNodeChainId
                        ].node.slice(-12)}`}
                      </div>
                      <Link
                        href={`${dataContracts[activeNodeChainId].explorer}/address/${dataContracts[activeNodeChainId].node}`}
                        target="_blank"
                      >
                        <LiaExternalLinkAltSolid className="ml-1 mt-1 cursor-pointer hover:text-blue" />
                      </Link>
                    </div>
                  )}
                </div>
                <div className="mb-[22px]">
                  <div className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    Interest Rate
                  </div>
                  <div className="w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-dark placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white">
                    APY {(supplyRate * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="mb-[22px]">
                  <div className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    TVL
                  </div>
                  <div className="flex w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-dark placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white">
                    {parseFloat(vaultBalance / 10 ** 6).toFixed(6)}{" "}
                    <span>
                      <Image
                        src={"/images/usdc.svg"}
                        alt="usdcIcon"
                        height={20}
                        width={20}
                        className="ml-2 mr-1 mt-0.5"
                      />
                    </span>{" "}
                    USDC
                  </div>
                </div>
                <div className="mb-[30px]">
                  <div className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    Last Time Warped
                  </div>
                  <div className="w-full resize-none border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-sm text-dark placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white">
                    {lastTimeWarped == 0
                      ? "NEVER"
                      : humanReadableDateFromTimestamp(lastTimeWarped)}
                  </div>
                </div>
                <div className="mb-[30px]">
                  <div className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    Vault Status{" "}
                    <span
                      className={`ml-2 font-bold ${!isWarping ? "text-green" : "text-yellow-600 dark:text-yellow"} `}
                    >
                      {!isWarping ? "Online" : "Warping"}
                    </span>
                    <ul className=" mt-2 list-inside list-disc">
                      <li>
                        Deposits:{" "}
                        <span
                          className={`ml-2 font-bold ${!isWarpingFromActiveNode ? "text-green" : "text-red-600 dark:text-red"} `}
                        >
                          {!isWarpingFromActiveNode
                            ? "Online"
                            : "Halted while warping"}
                        </span>
                      </li>
                      <li>
                        Withdraws:{" "}
                        <span
                          className={`ml-2 font-bold ${!isWarping ? "text-green" : "text-red-600 dark:text-red"} `}
                        >
                          {!isWarping ? "Online" : "Halted while warping"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeNodeChainId && (
        <>
          {" "}
          {depositModal && chainId == activeNodeChainId && (
            <DepositModal
              depositModal={depositModal}
              setDepositModal={setDepositModal}
              vaultBalance={vaultBalance}
              account={account}
              activeNodeChainId={activeNodeChainId}
              masterChainId={masterChainId}
              setVaultBalance={setVaultBalance}
            />
          )}
          {withdrawModal && userChainId == masterChainId && (
            <WithdrawModal
              withdrawModal={withdrawModal}
              setWithrawModal={setWithdrawModal}
              userChainId={userChainId}
              activeNodeChainId={activeNodeChainId}
              account={account}
              masterChainId={masterChainId}
              AWRPUserBalance={AWRPUserBalance}
              setAWRPUserBalance={setAWRPUserBalance}
              setAvaliableToWithdraw={setAvaliableToWithdraw}
            />
          )}
        </>
      )}
    </section>
  );
};

export default Dashboard;
