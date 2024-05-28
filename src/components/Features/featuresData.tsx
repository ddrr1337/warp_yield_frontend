import { Feature } from "@/types/feature";
import { RiOpenSourceLine } from "react-icons/ri";
import { TbUserOff } from "react-icons/tb";
import Image from "next/image";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: <RiOpenSourceLine className="text-white" size={40} />,
    title: "Free and Open-Source",
    paragraph: "Lorem Ipsum is simply dummy text of the printing and industry.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 2,
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30.5998 1.01245H5.39981C2.98105 1.01245 0.956055 2.9812 0.956055 5.4562V30.6562C0.956055 33.075 2.9248 35.0437 5.39981 35.0437H30.5998C33.0186 35.0437 34.9873 33.075 34.9873 30.6562V5.39995C34.9873 2.9812 33.0186 1.01245 30.5998 1.01245ZM5.39981 3.48745H30.5998C31.6123 3.48745 32.4561 4.3312 32.4561 5.39995V11.1937H3.4873V5.39995C3.4873 4.38745 4.38731 3.48745 5.39981 3.48745ZM3.4873 30.6V13.725H23.0623V32.5125H5.39981C4.38731 32.5125 3.4873 31.6125 3.4873 30.6ZM30.5998 32.5125H25.5373V13.725H32.4561V30.6C32.5123 31.6125 31.6123 32.5125 30.5998 32.5125Z"
          fill="white"
        />
      </svg>
    ),
    title: "Modern Design",
    paragraph: "Lorem Ipsum is simply dummy text of the printing and industry.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 3,
    icon: <TbUserOff className="text-white" size={40} />,
    title: "Full Permissionless",
    paragraph: "Lorem Ipsum is simply dummy text of the printing and industry.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 4,
    icon: <Image src={"/images/aave.svg"} alt="aave" height={30} width={30} />,
    title: "Integrated with AAVE",
    paragraph: "Lorem Ipsum is simply dummy text of the printing and industry.",
    btn: "Learn More",
    btnLink: "/#",
  },
];
export default featuresData;
