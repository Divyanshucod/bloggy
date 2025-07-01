import type { EditorType } from "../types";

export const withLinks = (editor: EditorType) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  return editor;
};
