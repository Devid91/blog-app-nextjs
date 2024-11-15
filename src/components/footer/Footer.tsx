import { FC } from "react";
import Image from "next/image";
import logo from "@/app/public/images/logo-color.png";

const Footer: FC = () => {
  return (
    <div className="flex  left-0  sm:fixed flex-row justify-center items-center bg-primary-color bottom-0  z-[40] w-full max-sm:h-[8vh] h-[6vh]   right-0        ">
      <div className="flex items-center justify-center w-full px-[1.5rem] min-h-full">
        <div className="flex items-center space-x-2 text-white">
          <Image className="w-10 h-10 rounded-full" src={logo} alt="Logo" />
          <div className="text-sm sm:text-lg">2024 Blog Yourself</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
