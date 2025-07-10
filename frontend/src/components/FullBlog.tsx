import { createEditor, type Descendant } from "slate";
import { MainEditor } from "./Editor/MainEditor";
import { withLinks } from "./Editor/utils/Link";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { Button } from "./Button";
import { CircularProgress, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog } from "../features/Blogs/BlogSlice";
import { toast, ToastContainer } from "react-toastify";
import type { RootState } from "../store";
import { useAppDispatch } from "../hooks";
import { type CustomElementType } from "@dev0000007/medium-web";
import { setPreview, togglePreviewButton } from "../features/Preview/PreviewSlice";
interface FullBlogProps {
  blog: Descendant[];
  authorOrNot: boolean;
  published: boolean;
  blogId:string
}

export const FullBlog = (props: FullBlogProps) => {
  const { isUpdating} = useSelector((state:RootState)=>state.BlogSlice)
  const [staleBlog,setStaleBlog] = useState<CustomElementType>([])
  const dispatch = useAppDispatch()
  // const preview = useSelector((state:RootState) => state.PreviewSlice)
  const dispatch2 = useDispatch()
  const [editor] = useState(() =>
    withLinks(withHistory(withReact(createEditor())))
  );
  const handleUpdate = async (val:boolean)=>{
      try {
        const res = await dispatch(updateBlog({
          published: val,
          blogId: props.blogId
        })).unwrap()
        toast.success(res)
        window.location.reload()
      } catch (error:any) {
        toast.error(error)
      }
  }
  useEffect(()=>{
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setStaleBlog(props.blog),
    dispatch2(setPreview(true))
  },[])
  return (
    <div className="w-full h-full pt-15">
      {/* Top Actions */}
      {props.authorOrNot && (
        <div className="flex justify-between mb-4 items-center">
          <div className="flex gap-2">
            {!props.published && (
              <Button
                disableButton={isUpdating === 'pending'}
                onClick={() => handleUpdate(true)}
              >
                {isUpdating === 'pending' ? <CircularProgress size={16} color="inherit" /> : "Publish"}
              </Button>
            )}
            <Button
              disableButton={isUpdating === 'pending' || JSON.stringify(props.blog) === JSON.stringify(staleBlog)}
              onClick={() => handleUpdate(props.published)}
            >
              {isUpdating === 'pending' ? <CircularProgress size={16} color="inherit" /> : "Update"}
            </Button>
          </div>
          
          <button
            onClick={() => dispatch2(togglePreviewButton())}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
            title="Toggle edit mode"
          >
            <Tooltip title='edit' placement="top-start">
            <SquarePen size={20} />
            </Tooltip>
          </button>
        </div>
      )}

      {/* Editor */}
      <MainEditor
        blog={props.blog}
        editor={editor}
      />
      <ToastContainer/>
    </div>
  );
};