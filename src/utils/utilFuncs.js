import { dataContracts, masterChainId } from "@/data/dataContracts";

export function formatFloat(num) {
  // Convertir el número a una cadena y dividirlo en partes entera y decimal
  let parts = num.toFixed(2).toString().split(".");

  // Obtener la parte entera
  let integerPart = parts[0];

  // Inicializar una cadena para almacenar el resultado formateado
  let formattedNum = "";

  // Recorrer la parte entera de atrás hacia adelante para agregar comas cada tres dígitos
  for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
    if (j % 3 === 0 && j !== 0) {
      formattedNum = "," + formattedNum;
    }
    formattedNum = integerPart[i] + formattedNum;
  }

  // Si hay una parte decimal, agregarla al resultado formateado
  if (parts.length > 1) {
    formattedNum += "." + parts[1];
  }

  return formattedNum;
}

export const saveTxHashByType = (
  txHash,
  type,
  fromChainId,
  toChainId,
  account,
) => {
  const existingTxs = JSON.parse(localStorage.getItem(type)) || [];
  const txDetails = {
    txHash: txHash,
    timestamp: new Date().toISOString(),
    fromChain: fromChainId,
    toChain: toChainId,
    type: type,
    caller: account,
  };
  existingTxs.push(txDetails);
  localStorage.setItem(type, JSON.stringify(existingTxs));
};

export const getTxHashesByType = (type) => {
  return JSON.parse(localStorage.getItem(type)) || [];
};

export const getAllTxHashesSortedByDate = () => {
  const depositTxs = getTxHashesByType("deposit");
  const withdrawTxs = getTxHashesByType("withdraw");
  const bridgeTxs = getTxHashesByType("bridge");

  const allTxs = [...depositTxs, ...withdrawTxs, ...bridgeTxs];

  allTxs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return allTxs;
};

export function humanReadableTime(isoTimeStr) {
  // Parse the ISO 8601 string to a Date object
  const date = new Date(isoTimeStr);

  // Format the Date object to a human-readable string
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  };

  const humanReadableStr = date
    .toLocaleString("en-US", options)
    .replace(",", "");

  return humanReadableStr;
}
