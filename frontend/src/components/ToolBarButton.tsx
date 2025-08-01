import type { LucideProps } from "lucide-react";
import { Tooltip } from "@mui/material";
import type { RichTextAction } from "./Editor/types";

export interface TextFormateButtonProps {
  id: RichTextAction;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
}
export const ToolBarButton = ({
  props,
  onClick,
  isActive,
}: {
  props: TextFormateButtonProps;
  onClick: () => void;
  isActive: boolean;
}) => {
  return (
    <button
      key={props.id}
      className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive &&
        "bg-blue-600 text-white hover:bg-blue-500 dark:hover:bg-blue-800"
      }`}
      title={props.id}
      onClick={onClick}
    >
      <Tooltip title={props.label} placement="top-start">
        <props.icon size={18} />
      </Tooltip>
    </button>
  );
};
