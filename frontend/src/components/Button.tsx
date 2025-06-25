import type React from "react";

interface buttonProps {
  children: React.ReactNode;
  onClick: () => void;
  disableButton?: boolean;
  color: string;
}
export const Button = ({
  children,
  onClick,
  disableButton = false,
  color,
}: buttonProps) => {
  return (
    <button disabled={disableButton} onClick={onClick} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
      {children}
    </button>
  );
};
