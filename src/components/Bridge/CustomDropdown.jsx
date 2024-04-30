"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";

const CustomDropdown = ({
  isOrigin,
  options,
  originChain,
  setOriginChain,
  setDestinationChain,
  overrideDestination,
  isDestination,
}) => {
  // Estado para la opción seleccionada

  const [selectedOption, setSelectedOption] = useState(null);
  // Estado para mostrar u ocultar el menú desplegable
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (overrideDestination && isDestination) {
      setSelectedOption(overrideDestination);
    }
  }, [overrideDestination]);

  return (
    <div className="relative">
      {/* Botón para abrir o cerrar el menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full justify-between rounded-md border-2  px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${!isOrigin && originChain && originChain?.chainId == selectedOption?.chainId ? "border-red-500" : "border-gray-300 dark:border-gray-600"}  focus:ring-indigo-500  `}
      >
        <div>
          {selectedOption ? (
            <div className="flex">
              <Image
                src={selectedOption.image}
                alt={selectedOption.text}
                className="mr-2 h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
              <div className="mt-1">{selectedOption.text}</div>
            </div>
          ) : (
            <div className="flex">
              <Image
                src={"/images/chain.png"}
                alt={"blockChain"}
                className="mr-2 h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
              <div className="mt-1">Select BlockChain</div>
            </div>
          )}
        </div>
        <IoIosArrowDown className="mt-2" size={15} />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-md  bg-white text-black shadow-lg dark:bg-dark-3 dark:text-white">
          {options.map((option) => (
            <div
              key={option.CCTPid}
              onClick={() => {
                setSelectedOption(option);
                setIsOpen(false);
                isOrigin ? setOriginChain(option) : setDestinationChain(option);
              }}
              className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-200 hover:dark:text-black "
            >
              {/* Imagen */}
              <Image
                src={option.image}
                alt={option.text}
                className="mr-2 h-8 w-8 rounded-full"
                width={32}
                height={32}
              />

              {option.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
