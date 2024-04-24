import Master from "./abiContracts/Master.json";
import Slave from "./abiContracts/Slave.json";
import ERC20 from "./abiContracts/ERC20.json";
import DataPool from "./abiContracts/IPoolDataProvider.json";

export const masterAbi = Master.abi;
export const slaveAbi = Slave.abi;
export const ERC20Abi = ERC20.abi;
export const dataPoolAbi = DataPool.abi;

export const aWrpDecimals = 10 ** 18;
export const usdcDecimals = 10 ** 6;
