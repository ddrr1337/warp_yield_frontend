import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

import Bridge from "@/components/Bridge/Bridge";

export const metadata: Metadata = {
  title: "Contact Page | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "This is contact page description",
};

const DashboardPage = () => {
  return (
    <>
      <Bridge />
    </>
  );
};

export default DashboardPage;
