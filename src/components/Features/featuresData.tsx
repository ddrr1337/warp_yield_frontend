import { Feature } from "@/types/feature";
import { RiOpenSourceLine } from "react-icons/ri";
import { TbUserOff } from "react-icons/tb";
import Image from "next/image";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: <RiOpenSourceLine className="text-white" size={40} />,
    title: "Free and Open-Source",
    paragraph:
      "Warp Yield is open source and will be allways open to everyone.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 2,
    icon: <Image src={"/images/next.svg"} alt="next" height={40} width={40} />,
    title: "Modern Design",
    paragraph:
      "React/Next.js frontend to help users through a simple and fast interface.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 3,
    icon: <TbUserOff className="text-white" size={40} />,
    title: "Full Permissionless",
    paragraph: "Any user can use the protocol without any limits.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 4,
    icon: <Image src={"/images/aave.svg"} alt="aave" height={30} width={30} />,
    title: "Integrated with AAVE",
    paragraph:
      "The main objective of the protocol is to capture the highest AAVE interest rates.",
    btn: "Learn More",
    btnLink: "/#",
  },
];
export default featuresData;
