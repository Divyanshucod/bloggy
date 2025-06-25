import { Editor, Element, Path, Transforms, Range, Node } from "slate";
import type {
  AlignKey,
  EditorType,
  ElementKey,
  MarkKey,
} from "../types";

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

// Check if selection contains a link
export const isLinkActive = (editor: EditorType) => {
  const [link] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  });
  return !!link;
};

// Wrap selected text with link (inline)
export const wrapLink = (editor: EditorType, url: string) => {
  // if (!isUrl(url)) return false;
  const { selection } = editor;
  if (!selection || Range.isCollapsed(selection)) return false;

  // Check if already in a link
  if (isLinkActive(editor)) {
    // Update existing link URL
    Transforms.setNodes(
      editor,
      { url },
      { match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link' }
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
  
  // Move cursor to end of link and ensure we're not in link context
  Transforms.collapse(editor, { edge: "end" });
  
  // Move cursor outside the link to continue typing normally
  const { selection: newSelection } = editor;
  if (newSelection) {
    const after = Editor.after(editor, newSelection);
    if (after) {
      Transforms.select(editor, after);
    }
  }
  
  return true;
};

// Insert image with proper alignment support
export const insertImage = (editor: EditorType, url: string) => {
  const imageBlock: Element = {
    type: "image",
    url,
    align: "left", // Default alignment
    children: [{ text: "" }],
  };

  const { selection } = editor;
  if (!selection) return;

  // Check if we're in an empty paragraph
  const [match] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && n.type === 'paragraph',
  });

  if (match) {
    const [node, path] = match;
    const isEmpty = Node.string(node).length === 0;
    
    if (isEmpty) {
      // Replace empty paragraph with image
      Transforms.setNodes(editor, imageBlock, { at: path });
      // Insert new paragraph after image
      const paragraphBlock: Element = {
        type: "paragraph",
        children: [{ text: "" }],
      };
      Transforms.insertNodes(editor, paragraphBlock, { at: Path.next(path) });
      Transforms.select(editor, Editor.start(editor, Path.next(path)));
      return;
    }
  }

  // Insert at the end of current block
  const [currentNode, currentPath] = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  }) || [];

  const insertPath = currentPath ? Path.next(currentPath) : [editor.children.length];

  // Insert image block
  Transforms.insertNodes(editor, imageBlock, { at: insertPath });

  // Insert paragraph block after image
  const paragraphBlock: Element = {
    type: "paragraph",
    children: [{ text: "" }],
  };
  const nextPath = Path.next(insertPath);
  Transforms.insertNodes(editor, paragraphBlock, { at: nextPath });

  // Move cursor to new paragraph
  Transforms.select(editor, Editor.start(editor, nextPath));
};

// Check if current selection is in an image block
export const isInImageBlock = (editor: EditorType) => {
  const [match] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && n.type === 'image',
  });
  return !!match;
};

// Get current image alignment
export const getCurrentImageAlignment = (editor: EditorType): AlignKey | undefined => {
  const [match] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && n.type === 'image',
  });
  
  if (match) {
    const [node] = match;
    return (node as any).align;
  }
  return undefined;
};

// Set image alignment
export const setImageAlignment = (editor: EditorType, align: AlignKey) => {
  const [match] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && n.type === 'image',
  });
  
  if (match) {
    const [, path] = match;
    Transforms.setNodes(editor, { align }, { at: path });
  }
};