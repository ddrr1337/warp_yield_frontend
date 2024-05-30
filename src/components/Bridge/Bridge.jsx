"use client";

import Image from "next/image";
import { MdOutlineDoubleArrow } from "react-icons/md";
import CustomDropdown from "./CustomDropdown";
import { useEffect, useState } from "react";
import { dataContracts } from "@/data/dataContracts";
import { bridgeOptions } from "@/data/bridgeOptions";
import { useMetaMask } from "metamask-react";
import {
  getERC20Balance,
  approveERC20,
  getERC20Allowance,
  sendAssetsToBridge,
  claimAssetsFromBridge,
  switchNetwork,
} from "../metamask/Metamask";
import Loading from "../Common/Loading";
import addObectToStorage from "../Common/addObjectToStorage";
import Web3 from "web3";
import { IoInformationCircleOutline } from "react-icons/io5";

import { saveTxHashByType } from "@/utils/utilFuncs";

// Opciones con imagen y texto

const Bridge = () => {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [usdcToBridge, setUsdcToBridge] = useState(0);
  const [originChain, setOriginChain] = useState(null);
  const [destinationChain, setDestinationChain] = useState(null);
  const [balanceUsdc, setBalanceUsdc] = useState(0);
  const [usdcAllowance, setUsdcAllowance] = useState(0);
  const [txHash, setTxHash] = useState(null);
  const [isSendingTx, setIsSendingTx] = useState(false);

  const [messageHash, setMessageHash] = useState(null);
  const [messageBytes, setMessageBytes] = useState(null);
  const [attestation, setAttestation] = useState(null);
  const [confirmations, setConfirmations] = useState(0);

  const [sendingToDestination, setSendingToDestination] = useState(false);
  const [bridgeComplete, setBridgeComplte] = useState(false);
  const [overrideDestination, setOverrideDestination] = useState(null);

  const handleInput = (e) => {
    let value = e.target.value;
    if (e.target.value < 0) {
      value = 0;
    }

    if (e.target.value >= parseFloat(balanceUsdc / 10 ** 6)) {
      value = parseFloat(balanceUsdc / 10 ** 6);
    }

    setUsdcToBridge(value);
  };

  const handleApprove = async () => {
    try {
      setIsSendingTx(true);
      const tx = await approveERC20(
        dataContracts[originChain.chainId].usdc,
        dataContracts[originChain.chainId].myBridge,
        usdcToBridge,
        10 ** 6,
      );
      if (tx && tx.wait) {
        await tx.wait();
        const response = await getERC20Allowance(
          dataContracts[originChain.chainId].usdc,
          account,
          dataContracts[originChain.chainId].myBridge,
        );
        setUsdcAllowance(response);
      }
    } catch (error) {
      console.error("Error approving USDC:", error);
    } finally {
      setIsSendingTx(false);
    }
  };

  const handleSendToBridge = async () => {
    try {
      setIsSendingTx(true);
      setTxHash(null);

      const tx = await sendAssetsToBridge(
        dataContracts[originChain.chainId].myBridge,
        usdcToBridge,
        dataContracts[destinationChain.chainId].chainCircleId,
      );
      if (tx && tx.wait) {
        await tx.wait();
        setTxHash(tx.hash);
        saveTxHashByType(
          tx.hash,
          "bridge",
          originChain.chainId,
          destinationChain.chainId,
          account,
        );
        const responseAllowance = await getERC20Allowance(
          dataContracts[originChain.chainId].usdc,
          account,
          dataContracts[originChain.chainId].myBridge,
        );
        setUsdcAllowance(responseAllowance);
        const responseBalanceUsdc = await getERC20Balance(
          dataContracts[originChain.chainId].usdc,
          account,
        );
        setBalanceUsdc(responseBalanceUsdc);
      }
    } catch (error) {
      console.error("Error sending USDC:", error);
    } finally {
      setIsSendingTx(false);
    }
  };

  useEffect(() => {
    if (originChain) {
      if (originChain.chainId == chainId) {
        getERC20Balance(dataContracts[originChain.chainId].usdc, account).then(
          (response) => {
            setBalanceUsdc(response);
          },
        );
        getERC20Allowance(
          dataContracts[originChain.chainId].usdc,
          account,
          dataContracts[originChain.chainId].myBridge,
        ).then((response) => setUsdcAllowance(response));
      }
    }
  }, [originChain, chainId]);

  const txHandler = async (tx) => {
    const web3 = new Web3(window.ethereum);
    const transactionReceipt = await web3.eth.getTransactionReceipt(tx);
    const eventTopic = web3.utils.keccak256("MessageSent(bytes)");
    const log = transactionReceipt.logs.find((l) => l.topics[0] === eventTopic);
    const messageBytes = web3.eth.abi.decodeParameters(["bytes"], log.data)[0];
    const messageHash = web3.utils.keccak256(messageBytes);
    setMessageBytes(messageBytes);
    setMessageHash(messageHash);
    return messageHash;
  };

  const setDestinationChainFronTx = async (tx) => {
    const web3 = new Web3(window.ethereum);
    const transactionReceipt = await web3.eth.getTransactionReceipt(tx);
    const eventTopic = web3.utils.keccak256(
      "DepositForBurn(uint64,address,uint256,address,bytes32,uint32,bytes32,bytes32)",
    );
    const log = transactionReceipt.logs.find((l) => l.topics[0] === eventTopic);
    const data = log.data;

    const result = web3.eth.abi.decodeParameters(
      ["uint256", "bytes32", "uint32", "bytes32", "bytes32"],
      log.data,
    );

    bridgeOptions.map((item) => {
      if (result[2] == item.CCTPid) {
        setDestinationChain(item);
        setOverrideDestination(item);
      }
    });
  };

  const fetchCircleApi = async (messageHash) => {
    const web3 = new Web3(window.ethereum);
    let attestationResponse = { status: "pending" };
    setSendingToDestination(true);
    while (attestationResponse.status != "complete") {
      const response = await fetch(
        `https://iris-api-sandbox.circle.com/attestations/${messageHash}`,
      );
      attestationResponse = await response.json();
      const currentBlockNumber = await web3.eth.getBlockNumber();
      const transaction = await web3.eth.getTransaction(txHash);
      const confirmations =
        currentBlockNumber - transaction.blockNumber + BigInt(1);
      setConfirmations(confirmations);
      await new Promise((r) => setTimeout(r, 2000));
    }

    setSendingToDestination(false);
    return attestationResponse;
  };

  useEffect(() => {
    if (txHash) {
      txHandler(txHash).then((response) =>
        fetchCircleApi(response).then((response) =>
          setAttestation(response.attestation),
        ),
      );
      setDestinationChainFronTx(txHash);
    }
  }, [txHash]);

  const handleClaimFromBridge = async () => {
    try {
      setIsSendingTx(true);
      const claimAssetsTx = await claimAssetsFromBridge(
        dataContracts[destinationChain.chainId].destinationCCTP,
        messageBytes,
        attestation,
      );
      if (claimAssetsTx && claimAssetsTx.wait) {
        await claimAssetsTx.wait();
        setBridgeComplte(true);
      }
    } catch (error) {
      console.error("Error claiming USDC:", error);
    } finally {
      setIsSendingTx(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 md:py-[120px]">
      <div className="absolute left-0 top-0 -z-[1] h-full w-full dark:bg-dark"></div>
      <div className="absolute left-0 top-0 -z-[1] h-1/2 w-full bg-[#E9F9FF] dark:bg-dark-700 lg:h-[45%] xl:h-1/2"></div>
      <div className="container px-4">
        <div className="-mx-4 flex flex-col items-center lg:flex-row">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div className="ud-contact-content-wrapper">
              <div className="ud-contact-title -mb-[100px] mt-20">
                <span className="mb-6 block text-base font-medium text-dark dark:text-white">
                  BRIDGE V0.9
                </span>
                <h2 className="  max-w-[300px]  text-[30px] font-semibold leading-[1.14] text-dark dark:text-white">
                  Bridge USDC To Multiple Chains
                </h2>
                <div className=" mt-2 text-xs">
                  <h5>
                    Fee ={" "}
                    <span className="text-blue-700 dark:text-blue-400">
                      1 USDC
                    </span>{" "}
                  </h5>
                  <h5>
                    This Fee will help to maintain WarpYeld Services, Thanks a
                    lot!
                  </h5>
                  <h5>
                    Fee is <span className=" font-bold">FIXED</span>, no matter
                    the amount you bridge.
                  </h5>
                </div>
              </div>

              <div className="mb-10 mt-40 xl:mb-0"></div>
            </div>
          </div>
          <div className="flex w-full items-center justify-center px-4 lg:w-5/12 xl:w-8/12">
            <div
              className="wow fadeInUp  h-[676px]   bg-white px-8 py-10 shadow-testimonial dark:bg-dark-2 dark:shadow-none sm:w-[500px] sm:px-10 sm:py-12 md:p-[60px] lg:p-10 lg:px-10 lg:py-12 2xl:p-[60px]"
              data-wow-delay=".2s
              "
            >
              <h3 className="mb-8 text-lg font-semibold text-dark dark:text-white  md:leading-[1.42] xl:text-2xl">
                Origin, Amount And Destination
              </h3>
              <p className="mb-1 ml-1">Select Origin BlockChain</p>
              <CustomDropdown
                isOrigin={true}
                options={bridgeOptions}
                originChain={originChain}
                setOriginChain={setOriginChain}
                setDestinationChain={setDestinationChain}
                isDestination={false}
                overrideDestination={overrideDestination}
              />
              <p className="mb-1 ml-1 mt-5">Select Destination BlockChain</p>
              <CustomDropdown
                isOrigin={false}
                options={bridgeOptions}
                originChain={originChain}
                setOriginChain={setOriginChain}
                setDestinationChain={setDestinationChain}
                isDestination={true}
                overrideDestination={overrideDestination}
              />
              <div className="mb-1 ml-1 mt-5 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
                <div className="w-1/2">
                  <p className="">Select Amount USDC</p>
                  <input
                    disabled={
                      originChain?.chainId == destinationChain?.chainId ||
                      !originChain ||
                      !destinationChain ||
                      originChain?.chainId != chainId
                    }
                    onChange={(e) => handleInput(e)}
                    value={
                      originChain?.chainId == destinationChain?.chainId
                        ? 0
                        : usdcToBridge
                    }
                    type="number"
                    name="tokens"
                    id="name"
                    className="flex h-[50px] w-full justify-between rounded-md border-2 border-gray-300 px-3 py-2 text-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:text-blue-400"
                    placeholder="Insert Tokens To Buy"
                    required=""
                  />
                </div>
                <div className="w-1/2">
                  <p className="ml-1">You Will Receive</p>
                  <div
                    id="receive"
                    className="flex h-[50px] w-full justify-between rounded-md border-2 border-gray-300 px-3 py-2 text-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:text-blue-400"
                    placeholder="Insert Tokens To Buy"
                  >
                    <div className="mt-1 flex w-full justify-between">
                      {usdcToBridge >= 1 ? usdcToBridge - 1 : 0}{" "}
                      <div className="flex">
                        <Image
                          src={"/images/usdc.svg"}
                          alt={"usdcToken"}
                          className="mb-0.5 ml-3 "
                          width={15}
                          height={15}
                        />
                        <div className="ml-1 mt-1.5 text-xs">USDC</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {originChain?.chainId == chainId && (
                  <div className="ml-1 mt-1 flex justify-start text-sm text-blue">
                    Balance:{" "}
                    <span className="mx-1">
                      {parseFloat(balanceUsdc / 10 ** 6).toFixed(2)}
                    </span>
                    <Image
                      src={`/images/usdc.svg`}
                      alt="usdcIcon"
                      height={14}
                      width={14}
                      className="mb-0.5 mr-1 "
                    />
                    USDC
                  </div>
                )}
                <div className="mt-5 flex justify-center">
                  {!messageHash && !attestation && (
                    <div>
                      {originChain?.chainId == chainId ? (
                        usdcAllowance >= usdcToBridge * 10 ** 6 ? (
                          <button
                            onClick={() => handleSendToBridge()}
                            disabled={usdcToBridge == 0}
                            className={`  
                        " w-48 items-center rounded-[4px] bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 
                        dark:focus:ring-blue-800 ${usdcToBridge == 0 ? "opacity-50" : "opacity-100"}
                        `}
                          >
                            {isSendingTx ? (
                              <Loading />
                            ) : (
                              <span>Send To {destinationChain?.text}</span>
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove()}
                            className={`  
               " w-48 items-center rounded-[4px] bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 
               dark:focus:ring-blue-800
              `}
                          >
                            {isSendingTx ? <Loading /> : "Approve USDC"}
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => switchNetwork(originChain.chainId)}
                          disabled={!originChain}
                          className={`  
                        " w-48 items-center rounded-[4px] bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 
                        dark:focus:ring-blue-800
                        `}
                        >
                          {!originChain ? (
                            "Select Origin Chain"
                          ) : (
                            <span>Connect To {originChain?.text}</span>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  {messageHash && attestation && !bridgeComplete && (
                    <button
                      onClick={() =>
                        chainId != destinationChain.chainId
                          ? switchNetwork(destinationChain.chainId)
                          : handleClaimFromBridge()
                      }
                      className={`${isSendingTx && "w-48"} items-center rounded-[4px] bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${!messageHash || !attestation ? "opacity-50" : ""}`}
                    >
                      {" "}
                      {isSendingTx ? (
                        <Loading />
                      ) : (
                        <>
                          {" "}
                          {chainId != destinationChain.chainId
                            ? `Click To Connect To ${dataContracts[destinationChain.chainId].formatedName} To Claim`
                            : `Claim USDC On ${dataContracts[destinationChain.chainId].formatedName}`}
                        </>
                      )}
                    </button>
                  )}
                  {bridgeComplete && (
                    <button
                      onClick={() => {
                        setTxHash(null);
                        setMessageHash(null);
                        setMessageBytes(null);
                        setAttestation(null);
                        setBridgeComplte(false);
                      }}
                      disabled={!messageHash || !attestation}
                      className={`w-48 items-center rounded-[4px] bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${!messageHash || !attestation ? "opacity-50" : ""}`}
                    >
                      Bridge More USDC
                    </button>
                  )}

                  {messageHash && !attestation && sendingToDestination && (
                    <div>
                      <div className="animate-pulse text-center text-green-600 dark:text-green-300">
                        Sending to{" "}
                        {dataContracts[destinationChain?.chainId]?.formatedName}
                        .... Please Whait
                      </div>
                      <div className="text-center text-sm">
                        {`${confirmations.toString()} Confirmations of ${dataContracts[originChain.chainId].bridgeConfirmations} Minimum Needed`}{" "}
                      </div>
                    </div>
                  )}
                </div>
                <div className=" relative mb-2 mt-14 flex items-center overflow-hidden rounded-lg border-2  border-gray-300 shadow-sm   dark:border-gray-600">
                  <div className="flex w-[160px] items-center self-stretch border-r-2 border-gray-300  bg-gray-200 px-2 dark:border-gray-600 dark:bg-gray-700">
                    <div className="font-display text-jacarta-700 mb-1 ml-2 mt-1 flex text-sm">
                      <IoInformationCircleOutline
                        size={18}
                        className="-ml-1 mr-1"
                      />{" "}
                      Manual Claim Tx:
                    </div>
                  </div>

                  <input
                    onChange={(e) => setTxHash(e.target.value)}
                    type="text"
                    className=" h-12 w-full flex-[3] border-0 px-2 focus:ring-indigo-500 dark:bg-dark-2"
                    placeholder="Tx Of Origin Blockchain"
                    value={txHash?.hash}
                  />
                </div>

                {bridgeComplete && (
                  <div className=" text-center text-green-600 dark:text-green-300">
                    Assets Bridge Complete, Thank You!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bridge;
