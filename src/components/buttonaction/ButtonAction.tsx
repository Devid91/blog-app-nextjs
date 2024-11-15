"use client";

import { twMerge } from "tailwind-merge";

export type ButtonActionProps = {
  children: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  userReadAllConditions?: boolean;
};

const ButtonAction = ({
  children,
  className,
  onClick,
  type = "submit",
  userReadAllConditions = true,
}: ButtonActionProps) => {
  const defaultClassName =
    "py-[0.25rem] px-[0.75rem] mb-[0.75rem] bg-secondary-color text-primary-color rounded-lg hover:scale-95";

  return (
    <button
      type={type}
      className={twMerge(defaultClassName, className)}
      onClick={onClick}
      disabled={!userReadAllConditions}
    >
      {children}
    </button>
  );
};

export default ButtonAction;
