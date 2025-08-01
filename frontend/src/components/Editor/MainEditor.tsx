
import type { EditorType } from "./types";
import { Editable, Slate } from "slate-react";
import { RenderLeaf } from "./utils/RenderLeaf";
import { onKeyDown } from "./utils/keyBinding";
import { RenderElement } from "./utils/RenderElements";
import { ToolBar } from "./ToolBar";
import { Eye } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCreateBlog, setCreateBlogTitle, setUpdateBlog, setUpdateBlogTitle, type BlogType } from "../../features/Blogs/BlogSlice";
import { togglePreviewButton } from "../../features/Preview/PreviewSlice";
import type { RootState } from "../../store";
import { Tags } from "../Tags";
import { useState } from "react";

interface editorType {
  blog: BlogType;
  editor: EditorType;
  isCreatingBlog?:boolean
}

export const MainEditor = (props: editorType) => {
  const dispatch = useDispatch()
  const preview = useSelector((state:RootState) => state.PreviewSlice)
  const [tagOnFocused,setTagOnFocused] = useState(false)

  return (
    <div className="relative w-full h-screen rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-1 md:px-4 pb-6 pt-3 shadow-sm transition-all">
      <Slate
        editor={props.editor}
        initialValue={props.blog.content}
        onChange={(value) => props.isCreatingBlog ? dispatch(setCreateBlog(value)) : dispatch(setUpdateBlog(value))}
      >
        {/* Toolbar only in edit mode */}
        {(!preview.value) ? (
          <div className="mb-4 sticky top-20 z-10">
            <ToolBar
            />
          </div>
        ) : null}
        <div className="overflow-y-auto rounded-md bg-white  dark:bg-gray-700 px-4 py-3 focus:outline-none text-gray-800 dark:text-gray-100 text-base leading-relaxed whitespace-pre-wrap h-[90%]">
        {/* header */}
        <textarea onFocus={() => setTagOnFocused(false)} placeholder="title" className="field-sizing-content w-full text-3xl md:text-4xl focus:outline-none font-bold p-0 border-r-white resize-none overflow-hidden" rows={1} readOnly={preview.value} value={props.blog.title} onChange={(e) => props.isCreatingBlog ? dispatch(setCreateBlogTitle(e.target.value)) : dispatch(setUpdateBlogTitle(e.target.value))}/>
        {/* tags */}
        <div className="mb-2">
        <Tags isCreatingBlog={props.isCreatingBlog} onFocused={tagOnFocused} setOnFocused={setTagOnFocused} tags={props.blog.tags}/>
        </div>
                {/* Main Editable Area */}
          <Editable
            readOnly={preview.value}
            autoFocus
            name="Post"
            placeholder="Write your story..."
            renderLeaf={RenderLeaf}
            onKeyDown={(event) => onKeyDown({ event, editor: props.editor })}
            renderElement={RenderElement}
            className="min-h-[450px] max-h-full focus:outline-none"
            style={{maxHeight:'100%', minHeight:'200px'}}
            onFocus={()=> setTagOnFocused(false)}
          />
        </div>

        {!preview.isForUpdateBlog && (
          <button
            onClick={() => {dispatch(togglePreviewButton())
            }}
            className="fixed right-4 bottom-[50%] p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Tooltip title={preview.value ? "Preview mode" : "Edit Mode"} placement="top-start">
            <Eye size={18} className="text-gray-800 dark:text-white" />
            </Tooltip>
          </button>
        )}
      </Slate>
    </div>
  );
};