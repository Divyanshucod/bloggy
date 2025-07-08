import { createEditor, type Descendant } from "slate";
import { MainEditor } from "./Editor/MainEditor";
import { withLinks } from "./Editor/utils/Link";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { Button } from "./Button";
import { CircularProgress, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { updateBlog } from "../features/Blogs/BlogSlice";
import { toast, ToastContainer } from "react-toastify";
import type { RootState } from "../store";
import { useAppDispatch } from "../hooks";
import { CustomElementType } from "@dev0000007/medium-web";
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
  const [editor] = useState(() =>
    withLinks(withHistory(withReact(createEditor())))
  );
  const [toggleEdit, setToggleEdit] = useState(true);
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
    setStaleBlog(props.blog)
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
                {isUpdating === 'pending' ? <CircularProgress size={16} /> : "Publish"}
              </Button>
            )}
            <Button
              disableButton={isUpdating === 'pending' || JSON.stringify(props.blog) === JSON.stringify(staleBlog)}
              onClick={() => handleUpdate(props.published)}
            >
              {isUpdating === 'pending' ? <CircularProgress size={16} /> : "Update"}
            </Button>
          </div>
          
          <button
            onClick={() => setToggleEdit((prev) => !prev)}
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
        isUpdate={true}
        editor={editor}
        readonly={toggleEdit}
      />
      <ToastContainer/>
    </div>
  );
};