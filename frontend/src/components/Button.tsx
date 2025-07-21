import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disableButton?: boolean;
  color?: "primary" | "secondary" | "outline" | "cancel";
}

export const Button = ({
  children,
  onClick,
  disableButton = false,
  color = "primary",
}: ButtonProps) => {
  const baseClasses =
    "text-sm font-medium px-4 py-2 rounded-full focus:outline-none transition-all duration-200";

  const colorClasses = {
    cancel:"px-4 py-2 text-sm font-medium rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition",
    primary:
      "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
    secondary:
      "text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800",
    outline:
      "border border-green-600 text-green-600 bg-transparent hover:bg-green-50 focus:ring-2 focus:ring-green-300",
  };

  const disabledClasses = disableButton
    ? "opacity-50 cursor-not-allowed"
    : "";

  return (
    <button
      type="button"
      disabled={disableButton}
      onClick={onClick}
      className={clsx(baseClasses, colorClasses[color], disabledClasses)}
    >
      {children}
    </button>
  );
};
