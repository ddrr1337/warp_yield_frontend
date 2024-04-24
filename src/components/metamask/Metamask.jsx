import React from "react";
import { useMetaMask } from "metamask-react";

import Image from "next/image";
import { ethers } from "ethers";
import {
  ERC20Abi,
  dataPoolAbi,
  masterAbi,
  slaveAbi,
} from "@/data/contractDeployments";

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

const getERC20Allowance = async (tokenAddress, owner, spender) => {
  const contract = getERC20Contract(tokenAddress);
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

const withdrawUsdc = async (
  contractAddress,
  chainIDCCIP,
  destinationNodeAddress,
  shares,
) => {
  const contract = getGenericContract(contractAddress, masterAbi);
  const withdraw = await contract.withdraw(
    chainIDCCIP,
    destinationNodeAddress,
    BigInt(shares * 10 ** 18),
  );
  return withdraw;
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
};
