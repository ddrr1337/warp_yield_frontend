import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team";
import { Metadata } from "next";

import TransactionTable from "./TransactionTable";

const Transactions = () => {
  return (
    <main>
      <Breadcrumb pageName="My Transactions" />
      <div className="container mt-10">
        <TransactionTable />
      </div>

      <div className="area h-[400px]">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </main>
  );
};

export default Transactions;
