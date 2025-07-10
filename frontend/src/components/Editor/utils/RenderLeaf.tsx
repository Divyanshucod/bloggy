// components/RenderLeaf.tsx
import type { RenderLeafProps } from "slate-react";
import { getLeafStyle } from "./leafStyles";

export const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.subscript) children = <sub>{children}</sub>;
  if (leaf.superscript) children = <sup>{children}</sup>;

  if (leaf.code)
    return (
        <code  {...attributes}
        className="bg-gray-100 dark:bg-gray-800 text-sm px-2 py-1 rounded overflow-x-auto inline-block text-red-500 font-mono">{children}</code>
    );

  return (
    <span {...attributes} style={getLeafStyle(leaf)}>
      {children}
    </span>
  );
};
