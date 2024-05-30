"use client";
import React from "react";
import { getAllTxHashesSortedByDate } from "@/utils/utilFuncs";
import { dataContracts, cahinLinkCCIPExplorer } from "@/data/dataContracts";
import Image from "next/image";
import Link from "next/link";

const TransactionTable = () => {
  const transactions = getAllTxHashesSortedByDate();
  //localStorage.clear();
  console.log(transactions);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="text-nowrap px-6 py-3">
              From Chain
            </th>
            <th scope="col" className="text-nowrap px-6 py-3">
              To Chain
            </th>
            <th scope="col" className="px-6 py-3">
              Tx Hash
            </th>
            <th scope="col" className="px-6 py-3">
              Caller
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr
              key={item.txHash}
              className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                <span
                  className={`${item.type == "deposit" && "text-green"} ${item.type == "withdraw" && "text-red"} ${item.type == "bridge" && "text-blue"} font-bold`}
                >
                  {item.type}
                </span>
              </th>

              <td className="flex justify-center px-6 py-4">
                <div className="flex justify-center">
                  <Image
                    src={dataContracts[item.fromChain].icon}
                    height={item.fromChain == 11155111 ? 16 : 22}
                    width={item.fromChain == 11155111 ? 16 : 22}
                    alt="fromChain"
                  />
                </div>
              </td>
              <td className="px-6 py-4">
                {" "}
                <div className="flex justify-center">
                  <Image
                    src={dataContracts[item.toChain].icon}
                    height={item.toChain == 11155111 ? 16 : 22}
                    width={item.toChain == 11155111 ? 16 : 22}
                    alt="toChain"
                  />
                </div>
              </td>
              <td className="px-6 py-4">
                <Link
                  href={
                    item.type == "deposit" || item.type == "withdraw"
                      ? `${cahinLinkCCIPExplorer}${item.txHash}`
                      : `${dataContracts[item.fromChain].explorer}tx/${item.txHash}`
                  }
                  target="_blank"
                  className=" hover:text-blue"
                >
                  <span className="hover:text-blue-500">{`${item.txHash.slice(
                    0,
                    15,
                  )}...${item.txHash.slice(-15)}`}</span>
                </Link>
              </td>
              <td className="px-6 py-4">
                {" "}
                <span className="">{`${item.txHash.slice(
                  0,
                  15,
                )}...${item.caller.slice(-7)}`}</span>
              </td>
              <td className="px-6 py-4">{item.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
