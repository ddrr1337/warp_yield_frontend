import React from "react";
import { dataContracts } from "@/data/dataContracts";
import Image from "next/image";
import copy from "copy-to-clipboard";

function TableAddresses() {
  const contractsArray = Object.values(dataContracts);
  return (
    <div className="relative overflow-x-auto shadow-testimonial ">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Blockchain
            </th>
            <th scope="col" className="px-6 py-3">
              USDC Addresses (Testnets)
            </th>

            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Copy</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {contractsArray.map((item, index) => (
            <tr
              key={index}
              className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
            >
              <th
                scope="row"
                className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white"
              >
                <div className="flex">
                  <Image
                    src={item.icon}
                    alt={"usdcToken"}
                    className="mr-2 "
                    width={item.chainCircleId == 0 ? 14 : 20}
                    height={item.chainCircleId == 0 ? 14 : 20}
                  />
                  {item.formatedName}
                </div>
              </th>
              <td className="px-6 py-4">{item.usdc}</td>

              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => copy(item.usdc)}
                  href="#"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableAddresses;
