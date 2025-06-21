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
    <button
      type="button"
      onClick={onClick}
      className={`text-white bg-[${color}] hover:bg-[${color}]/90 focus:ring-4 focus:outline-none focus:ring-[${color}]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2 disabled:cursor-not-allowed`}
      disabled={disableButton}
    >
      {children}
    </button>
  );
};
