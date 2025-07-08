import { Editor, Element, Path, Transforms, Range, Node } from "slate";
import type { AlignKey, CustomElement, EditorType, ElementKey, MarkKey } from "../types";

export const isMarkActive = (editor: EditorType, format: MarkKey) => {
  return !!Editor.marks(editor)?.[format];
};

export const toggleMark = (editor: EditorType, format: MarkKey) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    editor.removeMark(format);
  } else editor.addMark(format, true);
};

const isAlignFormat = (format: ElementKey) =>
  ["left", "center", "right", "justify"].includes(format);

const isListFormat = (format: ElementKey) =>
  ["numbered-list", "bulleted-list"].includes(format);

export const isBlockActive = (editor: EditorType, format: ElementKey) => {
  const { selection } = editor;
  if (!selection) return false;
  const isAlign = isAlignFormat(format);
  const blockType = isAlign ? "align" : "type";

  const match = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) =>
        !Editor.isEditor(node) &&
        Element.isElement(node) &&
        node[blockType] === format,
    })
  );
  return !!match.length;
};

export const toggleBlock = (editor: EditorType, format: ElementKey) => {
  const isAlign = isAlignFormat(format);
  const isList = isListFormat(format);
  const isActive = isBlockActive(editor, format);

  let align: AlignKey | undefined;
  let type: string | undefined;

  if (isAlign) {
    align = isActive ? undefined : (format as AlignKey);
  } else {
    type = isActive ? "paragraph" : format;
  }

  Transforms.unwrapNodes(editor, {
    match: (node) =>
      !Editor.isEditor(node) &&
      Element.isElement(node) &&
      isListFormat(node.type as ElementKey) &&
      !isAlignFormat(format),
    split: true,
  });

  if (!isActive && isList) {
    type = "list-item";
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }

  const newProperties: Partial<Element> = {};
  if (isAlign) newProperties["align"] = align;
  if (type) newProperties["type"] = type;
  Transforms.setNodes<Editor>(editor, newProperties);
};

const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch {
    return /^https?:\/\/.+/.test(str);
  }
};

export const isLinkActive = (editor: EditorType) => {
  const [link] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
  return !!link;
};

export const wrapLink = (editor: EditorType, url: string) => {
  if (!isUrl(url)) return false;
  const { selection } = editor;
  if (!selection || Range.isCollapsed(selection)) return false;
  if (isLinkActive(editor)) {
    Transforms.setNodes(
      editor,
      { url },
      {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
      }
    );
  } else {
    // Create new inline link
    const link: Element = {
      type: "link",
      url,
      children: [],
    };

    Transforms.wrapNodes(editor, link, { split: true });
  }

  Transforms.collapse(editor, { edge: "end" });
  const { selection: newSelection } = editor;
  if (newSelection) {
    const after = Editor.after(editor, newSelection);
    if (after) {
      Transforms.select(editor, after);
    }
  }

  return true;
};

export const insertImage = (editor:EditorType,url:string) => {
    const ImageElement:CustomElement = {
      type:'Image',
      url,
      children:[{text:''}],
    } 
    Transforms.insertNodes(editor,ImageElement);
    const paragraphElement:CustomElement= {
      type:'paragraph',
      children:[{text:''}]
    }
    Transforms.insertNodes(editor,paragraphElement);
}
