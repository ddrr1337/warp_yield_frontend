import React from "react";
import { useMetaMask } from "metamask-react";

import Image from "next/image";
import { ethers } from "ethers";
import {
  ERC20Abi,
  dataPoolAbi,
  masterAbi,
  slaveAbi,
  bridgeAbi,
  destinationCCTPBridge,
} from "@/data/contractDeployments";
import { dataContracts } from "@/data/dataContracts";

const providerInstanceContract = (contractAddress, abi, providerUrl) => {
  const provider = new ethers.providers.WebSocketProvider(providerUrl);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  return contract;
};
const getGenericContract = (contractAddress, abi) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  return contract;
};

const switchNetwork = async (chainId) => {
  if (window.ethereum) {
    try {
      // Solicita a MetaMask que cambie a la red objetivo
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      console.log(`Change to Blockchain ID: ${chainId}`);
    } catch (error) {
      // Manejar error
      if (error.code === 4902) {
        console.error("Blockchain not avaliable in metamask");
      } else {
        console.error("Error switching chain", error);
      }
    }
  } else {
    console.error("Metamask not installed");
  }
};

async function addNetworkToMetaMask(networkDetails) {
  if (window.ethereum) {
    try {
      // Solicitar agregar la red a MetaMask
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkDetails],
      });
      console.log("Blockchain added");
    } catch (error) {
      console.error("Error Adding Blockchain", error);
    }
  } else {
    console.error("Metamask not installed");
  }
}

const getERC20BalanceFromProvider = async (
  addressERC20,
  providerUrl,
  userAddress,
) => {
  const contract = providerInstanceContract(
    addressERC20,
    ERC20Abi,
    providerUrl,
  );
  const balance = await contract.balanceOf(userAddress);

  return balance;
};

const getTotalSupplyAWRPFromProvider = async (
  addressSlaveContract,
  providerUrl,
) => {
  const contract = providerInstanceContract(
    addressSlaveContract,
    slaveAbi,
    providerUrl,
  );
  const totalSupply = await contract.aWrpTotalSupplySlaveView();
  return totalSupply;
};

const getTotalSupplyAWRPSlaveView = async (contractAddress) => {
  const contract = getGenericContract(contractAddress, slaveAbi);
  const totalSupplySlaveView = await contract.aWrpTotalSupplySlaveView();
  return totalSupplySlaveView;
};

const getERC20Contract = (address) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, ERC20Abi, signer);

  return contract;
};

const getERC20Balance = async (address, account) => {
  const contract = getERC20Contract(address);
  const balance = await contract.balanceOf(account);

  return balance;
};

const getERC20Allowance = async (contractAddress, owner, spender) => {
  const contract = getERC20Contract(contractAddress);
  const allowance = await contract.allowance(owner, spender);
  return allowance;
};

const approveERC20 = async (tokenAddress, spender, amount, decimals) => {
  const contract = getERC20Contract(tokenAddress);
  const approve = await contract.approve(spender, BigInt(amount * decimals));
  return approve;
};

const depositUSDC = async (slaveAddress, amount) => {
  const contract = getGenericContract(slaveAddress, slaveAbi);
  const deposit = await contract.deposit(BigInt(amount * 10 ** 6));
  return deposit;
};

const getAvaliableToWithdraw = async (slaveAddress, shares) => {
  const contract = getGenericContract(slaveAddress, slaveAbi);
  const availableToWithdraw = contract.calculateSharesValue(shares);
  return availableToWithdraw;
};

const getAvaliableToWithdrawFromProvider = async (
  slaveAddress,
  provider,
  shares,
) => {
  const contract = providerInstanceContract(slaveAddress, slaveAbi, provider);
  const avaliableWithdraw = contract.calculateSharesValue(shares);
  return avaliableWithdraw;
};

const withdrawUsdc = async (chainIDCCIP, destinationNodeAddress, shares) => {
  const contract = getGenericContract(
    dataContracts[11155111].master,
    masterAbi,
  );
  const withdraw = await contract.withdraw(
    chainIDCCIP,
    destinationNodeAddress,
    BigInt(shares * 10 ** 18),
  );
  return withdraw;
};

const sendAssetsToBridge = async (
  bridgeContracAddress,
  amount,
  destinationCCTPId,
) => {
  const contract = getGenericContract(bridgeContracAddress, bridgeAbi);
  const sendToBridge = contract.sendAssetsToBridge(
    BigInt(amount * 10 ** 6),
    destinationCCTPId,
  );
  return sendToBridge;
};

const claimAssetsFromBridge = async (
  destinationCCTPAddress,
  message,
  attestation,
) => {
  const contract = getGenericContract(
    destinationCCTPAddress,
    destinationCCTPBridge,
  );
  const claimAssets = await contract.receiveMessage(message, attestation);
  return claimAssets;
};

const getLinkFeesDeposit = async (slaveContractAddress, account) => {
  const contract = getGenericContract(slaveContractAddress, slaveAbi);

  const masterCCIPId = dataContracts[11155111].chainIdCCIP;
  const masterContractAddress = dataContracts[11155111].master;
  const command = 0;
  const dummyMainNonceDeposits = 4; // abritrary number
  const dummyShares = BigInt(150 * 10 ** 18); // arbitrary number

  const abiCoder = ethers.utils.defaultAbiCoder;

  const dataBytes = abiCoder.encode(
    ["uint8", "address", "uint128", "uint256"],
    [command, account, dummyMainNonceDeposits, dummyShares],
  );

  const getLinkGas = contract.getLinkFees(
    masterCCIPId,
    masterContractAddress,
    dataBytes,
  );

  return getLinkGas;
};

const getLinkFeesWithdraw = async (
  destinationCCIPId,
  destinationNodeAddress,
  account,
) => {
  const contract = getGenericContract(
    dataContracts[11155111].master,
    masterAbi,
  );

  const command = 1;
  const dummyShares = BigInt(150 * 10 ** 18); // arbitrary number

  const abiCoder = ethers.utils.defaultAbiCoder;

  const dataBytes = abiCoder.encode(
    ["uint8", "address", "uint256"],
    [command, account, dummyShares],
  );

  const getLinkGas = contract.getLinkFees(
    destinationCCIPId,
    destinationNodeAddress,
    dataBytes,
  );

  return getLinkGas;
};

export {
  getERC20Balance,
  getERC20Allowance,
  approveERC20,
  getERC20BalanceFromProvider,
  getTotalSupplyAWRPFromProvider,
  getTotalSupplyAWRPSlaveView,
  depositUSDC,
  getAvaliableToWithdraw,
  getAvaliableToWithdrawFromProvider,
  withdrawUsdc,
  sendAssetsToBridge,
  claimAssetsFromBridge,
  switchNetwork,
  getLinkFeesDeposit,
  getLinkFeesWithdraw,
};
