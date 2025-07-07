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
  blog: Descendant[];
  isCreatingBlog?:boolean
}
export const RichEditor = React.memo(
  ({ blog , isCreatingBlog}: RichEditorProps) => {
    const [editor] = useState(() =>
      withLinks(withHistory(withReact(createEditor())))
    );
    return (
      <>
        <MainEditor
          blog={blog}
          editor={editor}
          readonly={false}
          isCreatingBlog={isCreatingBlog}
        />
      </>
    );
  }
);
