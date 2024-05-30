"use client";
import React from "react";
import { dataContracts } from "@/data/dataContracts";
import Image from "next/image";
import copy from "copy-to-clipboard";
import { getAllTxHashesSortedByDate } from "@/utils/utilFuncs";

function TableTx() {
  const txUserArray = getAllTxHashesSortedByDate();

  console.log("hola", txUserArray);

  return (
    <div className="relative overflow-x-auto shadow-testimonial ">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Tx Type
            </th>
            <th scope="col" className="px-6 py-3">
              From Chain
            </th>
            <th scope="col" className="px-6 py-3">
              To Chain
            </th>
            <th scope="col" className="px-6 py-3">
              Tx Hash
            </th>{" "}
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Copy</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {txUserArray.map((item, index) => (
            <tr
              key={index}
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white"
              >
                {item.type}
              </th>
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white"
              >
                <div className="flex">
                  <Image
                    src={dataContracts[item.fromCahin]}
                    alt={"fromChain"}
                    className="mr-2 "
                    width={20}
                    height={20}
                  />
                </div>
              </th>
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white"
              >
                <div className="flex">
                  <Image
                    src={dataContracts[item.toChain]}
                    alt={"toChain"}
                    className="mr-2 "
                    width={20}
                    height={20}
                  />
                </div>
              </th>

              <td className="px-6 py-4 text-right">{item.txHash}</td>
              <td className="px-6 py-4 text-right">{item.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableTx;
