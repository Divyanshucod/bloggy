import {
  Code,
  Highlighter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ListOrdered,
  List,
  Quote,
  Subscript,
  Superscript,
  AlignCenter,
  Italic,
  Strikethrough,
  Underline,
  Bold,
  Image,
  Link,
} from "lucide-react";

export enum RichTextAction {
  Bold = "bold",
  Italics = "italic",
  Underline = "underline",
  Strikethrough = "strikethrough",
  Superscript = "superscript",
  Subscript = "subscript",
  Highlight = "highlight",
  Code = "code",
  LeftAlign = "left",
  CenterAlign = "center",
  RightAlign = "right",
  JustifyAlign = "justify",
  Divider = "divider",
  BlockQuote = "block-quote",
  NumberedList = "numbered-list",
  BulletedList = "bulleted-list",
  Undo = "undo",
  Redo = "redo",
  Link = "link",
  Image = "image",
}

export const TEXT_FORMAT_OPTIONS = [
  { id: RichTextAction.Bold, icon: Bold, label: "Bold" },
  { id: RichTextAction.Italics, icon: Italic, label: "Italics" },
  { id: RichTextAction.Underline, icon: Underline, label: "Underline" },
  {
    id: RichTextAction.Highlight,
    icon: Highlighter,
    label: "Highlight",
  },
  {
    id: RichTextAction.Strikethrough,
    icon: Strikethrough,
    label: "Strikethrough",
  },
  {
    id: RichTextAction.Superscript,
    icon: Superscript,
    label: "Superscript",
  },
  {
    id: RichTextAction.Subscript,
    icon: Subscript,
    label: "Subscript",
  },
  {
    id: RichTextAction.Code,
    icon: Code,
    label: "Code",
  },
];

export const TEXT_BLOCK_OPTIONS = [
  {
    id: RichTextAction.LeftAlign,
    icon: AlignLeft,
    label: "Align Left",
  },
  {
    id: RichTextAction.CenterAlign,
    icon: AlignCenter,
    label: "Align Center",
  },
  {
    id: RichTextAction.RightAlign,
    icon: AlignRight,
    label: "Align Right",
  },
  {
    id: RichTextAction.JustifyAlign,
    icon: AlignJustify,
    label: "Align Justify",
  },
  {
    id: RichTextAction.BlockQuote,
    icon: Quote,
    label: "Block Quote",
  },
  {
    id: RichTextAction.BulletedList,
    icon: List,
    label: "Bulleted List",
  },
  {
    id: RichTextAction.NumberedList,
    icon: ListOrdered,
    label: "Numbered List",
  },
  {
    id: RichTextAction.Link,
    icon: Link,
    label: "Link",
  },
  {
    id: RichTextAction.Image,
    icon: Image,
    label: "Image",
  },
];

export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];
