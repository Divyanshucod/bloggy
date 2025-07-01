import { toggleMark } from ".";
import type { EditorType } from "../types";
interface keyDownType {
  event: any;
  editor: EditorType;
}
export const onKeyDown = ({ event, editor }: keyDownType) => {
  const key = event?.key?.toLowerCase();
  if (key === "b" && event.ctrlKey) toggleMark(editor, "bold");
  if (key === "y" && event.ctrlKey) editor.redo();
  if (key === "z" && event.ctrlKey) editor.undo();
};
