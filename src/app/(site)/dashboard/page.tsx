import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import Dashboard from "@/components/Dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Contact Page | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "This is contact page description",
};

const ContactPage = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default ContactPage;
