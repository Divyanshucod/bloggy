// utils/leafStyles.ts

export const getLeafStyle = (leaf: { [key: string]: any }): React.CSSProperties => {
  const base: React.CSSProperties = {};

  if (leaf.bold) base.fontWeight = "bold";
  if (leaf.italic) base.fontStyle = "italic";
  if (leaf.underline) base.textDecoration = "underline";
  if (leaf.strikethrough) base.textDecoration = "line-through";

  if (leaf.highlight) {
    const isDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    base.color = isDark ? "#000000" : "#000000";
    base.backgroundColor = isDark ? "#facc15" : "#fef08a";
    base.border = isDark ? "1px solid #facc15" : "1px solid #facc15";
    base.padding = "2px 4px";
    base.borderRadius = "4px";
  }

  return base;
};
