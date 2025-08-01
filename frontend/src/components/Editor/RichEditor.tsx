import { withReact } from "slate-react";
import React, { useEffect, useState } from "react";
import { createEditor } from "slate";
import type { CustomElement, CustomText, EditorType } from "./types";
import { withHistory } from "slate-history";
import { withLinks } from "./utils/Link";
import { MainEditor } from "./MainEditor";
import { withImages } from "./utils/Images";
import { useDispatch } from "react-redux";
import { setPreview } from "../../features/Preview/PreviewSlice";
import type { BlogType } from "../../features/Blogs/BlogSlice";
declare module "slate" {
  interface CustomTypes {
    Element: CustomElement;
    Editor: EditorType;
    Text: CustomText;
  }
}
interface RichEditorProps {
  blog:BlogType ;
  isCreatingBlog?:boolean
}
export const RichEditor = React.memo(
  ({ blog , isCreatingBlog}: RichEditorProps) => {
    const [editor] = useState(() =>
      withImages(withLinks(withHistory(withReact(createEditor()))))
    );
     const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(setPreview(false))
    },[])
    return (
      <>
        <MainEditor
          blog={blog}
          editor={editor}
          isCreatingBlog={isCreatingBlog}
        />
      </>
    );
  }
);
