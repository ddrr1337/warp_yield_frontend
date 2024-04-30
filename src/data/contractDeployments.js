import Master from "./abiContracts/Master.json";
import Slave from "./abiContracts/Slave.json";
import ERC20 from "./abiContracts/ERC20.json";
import DataPool from "./abiContracts/IPoolDataProvider.json";
import Bridge from "./abiContracts/Bridge.json";
import CircleBridge from "./abiContracts/IMessageTransmitter.json";

export const masterAbi = Master.abi;
export const slaveAbi = Slave.abi;
export const ERC20Abi = ERC20.abi;
export const dataPoolAbi = DataPool.abi;

export const bridgeAbi = Bridge.abi;
export const destinationCCTPBridge = CircleBridge.abi;

export const aWrpDecimals = 10 ** 18;
export const usdcDecimals = 10 ** 6;
