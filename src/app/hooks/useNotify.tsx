"use client";

import { toast, ToastOptions } from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { twMerge } from "tailwind-merge";
import styles from "../hooks/styles/notificationanimation.module.css";

const useNotify = () => {
  const notify = (message: string, success: boolean) => {
    toast.custom(
      (t: { visible: any }) => (
        <div
          className={twMerge(
            `text-[#171717] ${success ? "bg-white" : "bg-red-200"} flex items-center rounded px-8 py-4 shadow-md text-center`,
            t.visible ? styles.customEnter : styles.customExit
          )}
        >
          {success ? (
            <FaCheck className="mr-10 size-8 text-[#0080ff]" />
          ) : (
            <ImBlocked className="text-red-500 mr-10 size-8" />
          )}
          {message}
        </div>
      ),
      {
        position: "bottom-left",
        duration: 4000,
      } as ToastOptions
    );
  };

  return { notify };
};

export default useNotify;
