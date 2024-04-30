import React from "react";
import Link from "next/link";

function Logo({ isFooter }) {
  return (
    <div className="w-60 max-w-full px-4">
      <Link href="/" className={`navbar-logo block w-full`}>
        <div className=" scale-110">
          <div className="text-xl">
            <span className={`m-0.5 bg-blue-700 pl-12 pr-1 text-white `}>
              WARP
            </span>
            <span className={`font-light ${isFooter && "text-white"}`}>
              YIELD
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Logo;
