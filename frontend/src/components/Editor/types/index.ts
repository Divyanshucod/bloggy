import type { BaseEditor, Descendant } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";

export type EditorType = BaseEditor & ReactEditor & HistoryEditor;
export type CustomText = {
  text: string;
  bold?: boolean;
  superscript?: boolean;
  italic?: boolean;
  underline?: boolean;
  subscript?: boolean;
  code?: boolean;
  highlight?: boolean;
  strikethrough?: boolean;
};
export type CustomElement = {
  type: string;
  children: CustomText[];
  align?: AlignKey;
  url?: string;
};
export type LinkElement = { type: "link"; url: string; children: Descendant[] };
export type MarkKey =
  | "bold"
  | "underline"
  | "superscript"
  | "subscript"
  | "italic"
  | "code"
  | "highlight"
  | "strikethrough";
export type AlignKey = "left" | "center" | "right" | "justify";
export type ElementKey =
  | AlignKey
  | "numbered-list"
  | "block-quote"
  | "bulleted-list"
  | "list-item"
  | "link"
  | "image";
