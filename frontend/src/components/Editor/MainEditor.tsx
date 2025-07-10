import type { Descendant } from "slate";
import type { EditorType } from "./types";
import { Editable, Slate } from "slate-react";
import { RenderLeaf } from "./utils/RenderLeaf";
import { onKeyDown } from "./utils/keyBinding";
import { RenderElement } from "./utils/RenderElements";
import { ToolBar } from "./ToolBar";
import { Eye } from "lucide-react";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCreateBlog, setUpdateBlog } from "../../features/Blogs/BlogSlice";
import { togglePreviewButton } from "../../features/Preview/PreviewSlice";
import type { RootState } from "../../store";

interface editorType {
  blog: Descendant[];
  editor: EditorType;
  isCreatingBlog?:boolean
}

export const MainEditor = (props: editorType) => {
  const dispatch = useDispatch()
  const preview = useSelector((state:RootState) => state.PreviewSlice)
  
  return (
    <div className="relative w-full h-screen rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 pb-6 pt-3 shadow-sm transition-all">
      <Slate
        editor={props.editor}
        initialValue={props.blog}
        onChange={(value) => props.isCreatingBlog ? dispatch(setCreateBlog(value)) : dispatch(setUpdateBlog(value))}
      >
        {/* Toolbar only in edit mode */}
        {(!preview.value) ? (
          <div className="mb-4 sticky top-20 z-10">
            <ToolBar
            />
          </div>
        ) : null}

        {/* Main Editable Area */}
        <div className="overflow-y-auto rounded-md bg-white  dark:bg-gray-700 px-4 py-3 focus:outline-none text-gray-800 dark:text-gray-100 text-base leading-relaxed whitespace-pre-wrap h-[450px] md:h-[90%]">
          <Editable
            readOnly={preview.value}
            name="Post"
            placeholder="Use H1,H2 for Title:"
            autoFocus
            renderLeaf={RenderLeaf}
            onKeyDown={(event) => onKeyDown({ event, editor: props.editor })}
            renderElement={RenderElement}
            className="min-h-[450px] max-h-full focus:outline-none"
            style={{maxHeight:'650px', overflowY:'auto', minHeight:'200px'}}
          />
        </div>

        {/* Preview toggle (only when not update mode) */}
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