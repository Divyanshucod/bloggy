import type { RenderLeafProps } from "slate-react";

export const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.subscript) children = <sub>{children}</sub>;
  if (leaf.superscript) children = <sup>{children}</sup>;
  if (leaf.code)
    return (
      <pre {...attributes} className="bg-gray-100 rounded">
        <code>{children}</code>
      </pre>
    );
  return (
    <span
      {...attributes}
      style={{
        ...(leaf.bold && { fontWeight: "bold" }),
        ...(leaf.italic && { fontStyle: "italic" }),
        ...(leaf.underline && { textDecoration: "underline" }),
        ...(leaf.strikethrough && { textDecoration: "line-through" }),
        ...(leaf.highlight && {
          color: "black",
          padding: 2,
          background: "#f3ff63",
          border: "1px solid #c6c202",
        }),
      }}
    >
      {children}
    </span>
  );
};
