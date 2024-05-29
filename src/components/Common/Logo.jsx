import React from "react";
import Link from "next/link";

function Logo({ isFooter, isSticky = false, isHomePage = false }) {
  return (
    <div className="w-60 max-w-full px-4">
      <Link href="/" className={`navbar-logo block w-full`}>
        <div className=" scale-110">
          <div className="text-xl">
            <span
              className={`m-0.5 ${!isSticky && isHomePage ? "bg-white text-blue-700" : "bg-blue-700 text-white"}  pl-12 pr-1  `}
            >
              WARP
            </span>
            {!isSticky && isHomePage ? (
              <span className={`font-light text-white`}>YIELD</span>
            ) : !isFooter ? (
              <span className={`font-light text-dark dark:text-white`}>
                YIELD
              </span>
            ) : (
              <span className={`font-light text-white`}>YIELD</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Logo;
