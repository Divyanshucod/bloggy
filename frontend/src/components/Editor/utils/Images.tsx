import type { EditorType } from "../types";

export const withImages = (editor: EditorType) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "Image" ? true : isVoid(element);
  };

  return editor;
};
