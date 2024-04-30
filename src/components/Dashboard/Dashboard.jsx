"use client";

import Image from "next/image";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { IoInformationCircleOutline } from "react-icons/io5";

import { FaArrowRight } from "react-icons/fa";

import { dataContracts } from "@/data/dataContracts";
import {
  getERC20BalanceFromProvider,
  getAvaliableToWithdrawFromProvider,
  switchNetwork,
} from "@/components/metamask/Metamask";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import DepositModal from "@/components/modals/DepositModal";
import WithdrawModal from "@/components/modals/WithdrawModal";
import { useMetaMask } from "metamask-react";
import { connected } from "process";

const Dashboard = () => {
  const activeNodeChain = "arbitrum";
  const activeNodeChainId = 421614;
  const masterChainId = 11155111;

  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [vaultBalance, setVaultBalance] = useState(0);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [usdcUserBalance, setUsdcUserBalance] = useState(0);
  const [AWRPUserBalance, setAWRPUserBalance] = useState(0);
  const [avaliableToWithdraw, setAvaliableToWithdraw] = useState(0);

  const userChainId = chainId && parseInt(chainId, 16);

  useEffect(() => {
    if (activeNodeChainId) {
      getERC20BalanceFromProvider(
        dataContracts[activeNodeChainId].ausdc,
        dataContracts[activeNodeChainId].provider.alchemy,
        dataContracts[activeNodeChainId].slave,
      ).then((response) => {
        setVaultBalance(response);
      });
    }
  }, [activeNodeChainId]);

  useEffect(() => {
    const getDepositTransactions = async () => {
      // Consulta todos los eventos de depósito del usuario
      const filter = {
        address: dataContracts[activeNodeChainId].slave,
        topics: [
          ethers.utils.id("Deposit(address,uint256)"),
          ethers.utils.hexZeroPad(account, 32),
        ],
        fromBlock: 0, // Puedes especificar el bloque inicial
        toBlock: "latest",
      };
      const logs = await provider.getLogs(filter);
      return logs;
    };
  }, []);

  useEffect(() => {
    if (account && activeNodeChainId) {
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
        if (response != 0) {
          getAvaliableToWithdrawFromProvider(
            dataContracts[activeNodeChainId].slave,

            dataContracts[activeNodeChainId].provider.alchemy,
            response,
          ).then((response) => setAvaliableToWithdraw(response));
        }
      });
    }
  }, [account, activeNodeChainId]);

  useEffect(() => {
    setDepositModal(false);
    setWithdrawModal(false);
  }, [chainId]);

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
                  DASHBOARD V1
                </span>
                <h2 className="max-w-[260px] text-[30px] font-semibold leading-[1.14] text-dark dark:text-white">
                  Deposit And Withdraw Assets
                </h2>
              </div>
              <div className="mb-12 flex flex-wrap justify-between lg:mb-0">
                <div className="mb-8 flex w-full max-w-full ">
                  <div className="">
                    <table className="-ml-10 w-full  text-left  text-gray-500 dark:text-gray-400 rtl:text-right">
                      <thead className=" bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-center">
                            Asset
                          </th>
                          <th scope="col" className="px-6 py-3 text-center">
                            Your Balance
                          </th>
                          <th scope="col" className="px-6 py-3 text-center">
                            Avl To Withdraw
                          </th>
                          <th scope="col" className=" px-6 py-3 text-center">
                            <div className="flex">
                              Deposit{" "}
                              <span>
                                <IoInformationCircleOutline
                                  className="ml-1 mt-1"
                                  size={13}
                                />
                              </span>
                            </div>
                          </th>
                          <th scope="col" className=" px-6 py-3 text-center">
                            <div className="flex">
                              Withdraw{" "}
                              <span>
                                <IoInformationCircleOutline
                                  className="ml-1 mt-1"
                                  size={13}
                                />
                              </span>
                            </div>
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
                            {parseFloat(usdcUserBalance / 10 ** 6).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center text-sm">
                            {parseFloat(avaliableToWithdraw / 10 ** 6).toFixed(
                              2,
                            )}
                          </td>
                          <td className=" px-6 py-4">
                            <div className="flex justify-center">
                              <Image
                                src={"/images/arbitrum.svg"}
                                alt="chainImg"
                                height={25}
                                width={25}
                                className="mr-2"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <Image
                                src={"/images/ethereum.svg"}
                                alt="chainImg"
                                height={15}
                                width={15}
                                className=""
                              />
                              <FaArrowRight className="mx-2 mt-1" />
                              <Image
                                src={"/images/arbitrum.svg"}
                                alt="chainImg"
                                height={25}
                                width={25}
                                className=""
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <button
                                onClick={() => {
                                  account
                                    ? chainId != activeNodeChainId
                                      ? switchNetwork(activeNodeChainId)
                                      : setDepositModal(true)
                                    : connect();
                                }}
                                className="inline-flex items-center justify-center rounded-[4px] bg-primary px-3 py-2 text-sm  font-medium text-white transition duration-300 ease-in-out hover:bg-primary/90"
                              >
                                Deposit
                              </button>
                              <button
                                onClick={() => {
                                  account
                                    ? chainId != masterChainId
                                      ? switchNetwork(masterChainId)
                                      : setWithdrawModal(true)
                                    : connect();
                                }}
                                className="ml-2 inline-flex items-center justify-center rounded-[4px] bg-primary px-3 py-2 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-primary/90"
                              >
                                Withdraw
                              </button>
                            </div>
                          </td>
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
                  <div className="flex">
                    <Image
                      src={dataContracts[activeNodeChainId].icon}
                      alt="chainImg"
                      height={20}
                      width={20}
                      className="mr-2"
                    />
                    <div className="block pt-1 text-sm text-dark dark:text-white">
                      {`${dataContracts[activeNodeChainId].slave.slice(0, 12)}...${dataContracts[
                        activeNodeChainId
                      ].slave.slice(-12)}`}
                    </div>
                    <Link
                      href={`${dataContracts[activeNodeChainId].explorer}address/${dataContracts[activeNodeChainId].slave}`}
                      target="_blank"
                    >
                      <LiaExternalLinkAltSolid className="ml-1 mt-1 cursor-pointer hover:text-blue" />
                    </Link>
                  </div>
                </div>
                <div className="mb-[22px]">
                  <div className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    Interest Rate
                  </div>
                  <div className="w-full border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-dark placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white">
                    APY 8.02%
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
                  <div className="w-full resize-none border-0 border-b border-[#f1f1f1] bg-transparent pb-3 text-dark placeholder:text-body-color/60 focus:border-primary focus:outline-none dark:border-dark-3 dark:text-white">
                    Sun 14 April 2024
                  </div>
                </div>
                <div className="mb-[30px]">
                  <div className="mb-4 block text-sm text-body-color dark:text-dark-6">
                    Vault Status{" "}
                    <span className="ml-2 font-bold text-green">Online</span>
                    <ul className=" mt-2 list-inside list-disc">
                      <li>
                        Deposits:{" "}
                        <span className="font-bold text-green">Online</span>
                      </li>
                      <li>
                        Withdraws:{" "}
                        <span className="font-bold text-green">Online</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {depositModal && chainId == activeNodeChainId && (
        <DepositModal
          depositModal={depositModal}
          setDepositModal={setDepositModal}
          vaultBalance={vaultBalance}
          account={account}
          activeNodeChainId={activeNodeChainId}
          masterChainId={masterChainId}
        />
      )}
      {withdrawModal && dataContracts[userChainId]?.chainName == "sepolia" && (
        <WithdrawModal
          withdrawModal={withdrawModal}
          setWithrawModal={setWithdrawModal}
          userChainId={userChainId}
          activeNodeChainId={activeNodeChainId}
          account={account}
          masterChainId={masterChainId}
        />
      )}
    </section>
  );
};

export default Dashboard;
