import React from "react";
import { useMetaMask } from "metamask-react";

import Image from "next/image";
import { ethers } from "ethers";
import {
  ERC20Abi,
  dataPoolAbi,
  masterAbi,
  nodeAbi,
  bridgeAbi,
  destinationCCTPBridge,
} from "@/data/contractDeployments";
import {
  dataContracts,
  masterChainId,
  getChainIdByChainIdCCIP,
} from "@/data/dataContracts";

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
    nodeAbi,
    providerUrl,
  );
  const totalSupply = await contract.aWrpTotalSupplyNodeSide();
  return totalSupply;
};

const getActiveNodeChainIdCCIP = async (contractAddress, provider) => {
  const contract = providerInstanceContract(
    contractAddress,
    masterAbi,
    provider,
  );
  const activeNodeChainId = await contract.getChainIdFromActiveNode();
  return activeNodeChainId;
};

const getTotalSupplyAWRPSlaveView = async (contractAddress) => {
  const contract = getGenericContract(contractAddress, nodeAbi);
  const totalSupplySlaveView = await contract.aWrpTotalSupplyNodeSide();
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

const depositUSDC = async (nodeAddress, amount) => {
  const contract = getGenericContract(nodeAddress, nodeAbi);
  const deposit = await contract.deposit(BigInt(amount * 10 ** 6));
  return deposit;
};

const getAvaliableToWithdraw = async (nodeAddress, shares) => {
  const contract = getGenericContract(nodeAddress, nodeAbi);
  const availableToWithdraw = contract.calculateSharesValue(shares);
  return availableToWithdraw;
};

// is frgom provider cuz i want user can see avl to witdrawl being not in same chain
const getAvaliableToWithdrawFromProvider = async (
  nodeAddress,
  provider,
  shares,
) => {
  const contract = providerInstanceContract(nodeAddress, nodeAbi, provider);
  const avaliableWithdraw = contract.calculateSharesValue(shares);
  return avaliableWithdraw;
};

const withdrawUsdc = async (shares) => {
  const contract = getGenericContract(
    dataContracts[masterChainId].master,
    masterAbi,
  );
  const withdraw = await contract.withdraw(BigInt(shares * 10 ** 18));
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

const getLinkFeesDeposit = async (account, activeNodeChainId) => {
  const masterContractAddress = dataContracts[masterChainId].master;

  const nodeContract = getGenericContract(
    dataContracts[activeNodeChainId].node,
    nodeAbi,
  );

  const masterCCIPId = dataContracts[masterChainId].chainIdCCIP;

  const command = 0;

  const dummyShares = BigInt(150 * 10 ** 18); // arbitrary number

  const abiCoder = ethers.utils.defaultAbiCoder;

  const dataBytes = abiCoder.encode(
    ["uint8", "address", "uint256"],
    [command, account, dummyShares],
  );

  const getLinkGas = await nodeContract.getLinkFees(
    masterCCIPId,
    masterContractAddress,
    dataContracts[activeNodeChainId].link,
    dataContracts[activeNodeChainId].router_ccip_address,
    dataBytes,
  );

  return getLinkGas;
};

const getLinkFeesWithdraw = async (account, activeNodeChainId) => {
  const masterContract = getGenericContract(
    dataContracts[masterChainId].master,
    masterAbi,
  );

  const command = 0;

  const dummyShares = BigInt(150 * 10 ** 18); // arbitrary number

  const abiCoder = ethers.utils.defaultAbiCoder;

  const dataBytes = abiCoder.encode(
    ["uint8", "address", "uint256"],
    [command, account, dummyShares],
  );

  const getLinkGas = await masterContract.getLinkFees(
    dataContracts[activeNodeChainId].chainIdCCIP,
    dataContracts[activeNodeChainId].node,
    dataContracts[masterChainId].link,
    dataContracts[masterChainId].router_ccip_address,
    dataBytes,
  );

  return getLinkGas;
};

const getNodeAaveSupplyRate = async (activeNodeChainId) => {
  const contract = providerInstanceContract(
    dataContracts[activeNodeChainId].node,
    nodeAbi,
    dataContracts[activeNodeChainId].provider.alchemy,
  );
  const getSupplyRate = await contract.getAaveSupplyRate(
    dataContracts[activeNodeChainId].aave_data_provider,
    dataContracts[activeNodeChainId].usdc,
  );

  return getSupplyRate;
};

const getIsWarpingNodeFromProvider = async () => {
  const contract = providerInstanceContract(
    dataContracts[masterChainId].master,
    masterAbi,
    dataContracts[masterChainId].provider.alchemy,
  );

  const activeNodeAddress = await contract.activeNode();
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  return activeNodeAddress.toLowerCase() === ZERO_ADDRESS.toLowerCase();
};

export {
  getIsWarpingNodeFromProvider,
  getNodeAaveSupplyRate,
  getActiveNodeChainIdCCIP,
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
