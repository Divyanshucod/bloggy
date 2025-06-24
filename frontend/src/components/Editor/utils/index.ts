import { Editor, Element, Transforms } from "slate";
import type {
  AlignKey,
  EditorType,
  ElementKey,
  MarkKey,
} from "../types";

export const isMarkActive = (editor: EditorType, formate: MarkKey) => {
  return !!Editor.marks(editor)?.[formate];
};
export const toggleMark = (editor: EditorType, formate: MarkKey) => {
  const isActive = isMarkActive(editor, formate);
  if (isActive) {
    editor.removeMark(formate);
  } else editor.addMark(formate, true);
};
const isAlignFormate = (formate: ElementKey) =>
  ["left", "center", "right", "justify"].includes(formate);
const isListFormate = (formate: ElementKey) =>
  ["numbered-list", "bulleted-list"].includes(formate);
// const isImageFormate = (formate:ElementKey) => ["Image"].includes(formate)
const isLinkFormate = (formate:ElementKey) => ["Link"].includes(formate)
export const isBlockActive = (editor: EditorType, formate: ElementKey) => {
  const { selection } = editor;
  if (!selection) return false;
  const isAlign = isAlignFormate(formate);
  const blockType = isAlign ? "align" : "type";
  const match = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) => {
        return (
          !Editor.isEditor(node) &&
          Element.isElement(node) &&
          node[blockType] === formate
        );
      },
    })
  );
  return !!match?.[0];
};
export const toggleBlock = (editor: EditorType, formate: ElementKey) => {
  const isAlign = isAlignFormate(formate);
  const isList = isListFormate(formate);
  const isActive = isBlockActive(editor, formate);
  // const isImage = isImageFormate(formate)
  const isLink = isLinkFormate(formate)
  if(isLink){
    insertBlockBelow(editor,'a','','') // make the ui visible for entering text and link
    // then insertLink call
  }
  let align: AlignKey | undefined;
  let type: string | undefined;
  if (isAlign) {
    align = isActive ? undefined : (formate as AlignKey);
  } else {
    type = isActive ? "paragraph" : formate;
  }
  Transforms.unwrapNodes(editor, {
    match: (node) => {
      return (
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        isListFormate(node.type as ElementKey) &&
        !isAlignFormate(formate)
      );
    },
  });
  if (!isActive && isList) {
    type = "list-item";
    const block = { type: formate, children: [] };
    Transforms.wrapNodes(editor, block);
  }
  const newProperties: Partial<Element> = {};
  if (isAlign) {
    newProperties["align"] = align;
  }
  if (type) {
    newProperties["type"] = type;
  }
  Transforms.setNodes<Editor>(editor, newProperties);
};
const isUrl = (str:string)=>{
const regex = /https?:\/\/(?:www\.)?(?:photos\.app\.goo\.gl|youtube\.com|youtu\.be|instagram\.com|twitter\.com|stackoverflow\.com|github\.com)\/[^\s]+/gi;
const found = str.match(regex);
return found;
}

export const insertBlockBelow = (editor: EditorType, type: string, text = "",url:string) => {
  if(!isUrl(url)){
      return false;
  }
  const block: Element = {
    type,
    children: [{ text }],
  };

  const { selection } = editor;
  if (!selection) return;

  // Get the current block path
  const [currentNode, currentPath] = Editor.above(editor, {
    match: n => Editor.isBlock(editor, n),
  }) || [];

  if (!currentPath) return;

  const insertPath = Path.next(currentPath); // path directly after current block

  // Insert the new block at the next path
  Transforms.insertNodes(editor, block, { at: insertPath });

  // Move cursor to start of the inserted block
  const startOfInserted = Editor.start(editor, insertPath);
  Transforms.select(editor, startOfInserted);
};