import { withReact } from "slate-react";
import React, { useState } from "react";
import { createEditor, type Descendant } from "slate";
import type { CustomElement, CustomText, EditorType } from "./types";
import { withHistory } from "slate-history";
import { withLinks } from "./utils/Link";
import { MainEditor } from "./MainEditor";
declare module "slate" {
  interface CustomTypes {
    Element: CustomElement;
    Editor: EditorType;
    Text: CustomText;
  }
}
interface RichEditorProps {
  setBlog: React.Dispatch<React.SetStateAction<Descendant[]>>;
  blog: Descendant[];
  handleClick?: ({ createDraft }: { createDraft: boolean }) => void;
  isloading: boolean;
}
export const RichEditor = React.memo(
  ({ setBlog, isloading, handleClick, blog }: RichEditorProps) => {
    const [editor] = useState(() =>
      withLinks(withHistory(withReact(createEditor())))
    );
    return (
      <>
        <MainEditor
          isloading={isloading}
          blog={blog}
          setBlog={setBlog}
          handleClick={handleClick}
          editor={editor}
          readonly={false}
        />
      </>
    );
  }
);
