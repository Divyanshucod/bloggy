import { createEditor } from "slate";
import { MainEditor } from "./Editor/MainEditor";
import { withLinks } from "./Editor/utils/Link";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { useEffect, useRef, useState } from "react";
import { SquarePen, User } from "lucide-react";
import { Button } from "./Button";
import { CircularProgress, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog, type authorDetails, type BlogType, type extras } from "../features/Blogs/BlogSlice";
import { toast, ToastContainer } from "react-toastify";
import type { RootState } from "../store";
import { useAppDispatch, useElementInView } from "../hooks";
import { type CustomElementType } from "@dev0000007/medium-web";
import { setPreview, togglePreviewButton } from "../features/Preview/PreviewSlice";
import { CommentSection } from "./CommentSection";
import UserProfile from "./Profile";
import EmojiReactionToggler from "./Reactions";
interface FullBlogProps {
  blog: BlogType & extras;
  authorOrNot: boolean;
  authorDetails: authorDetails;
  blogId:string
}

export const FullBlog = (props: FullBlogProps) => {
  const { isUpdating} = useSelector((state:RootState)=>state.BlogSlice)
  const [staleBlog,setStaleBlog] = useState<CustomElementType>([])
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [targetRef, isInView] = useElementInView({threshold:0.2})
  const dispatch = useAppDispatch()
  // const preview = useSelector((state:RootState) => state.PreviewSlice)
  const parentRef = useRef(null)
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
  console.log(props.blog, "full blog props");
  
  useEffect(()=>{
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setStaleBlog(props.blog),
    dispatch2(setPreview(true))
  },[])
  return (
    <div className="w-full h-full pt-15 relative" ref={parentRef}>
      {/* Top Actions */}
        <div className="flex justify-between mb-4 items-center">
          {props.authorOrNot && <div className="flex gap-2">
            {!props.authorDetails.published && (
              <Button
                disableButton={isUpdating === 'pending'}
                onClick={() => handleUpdate(true)}
              >
                {isUpdating === 'pending' ? <CircularProgress size={16} color="inherit" /> : "Publish"}
              </Button>
            )}
            <Button
              disableButton={isUpdating === 'pending' || JSON.stringify(props.blog) === JSON.stringify(staleBlog)}
              onClick={() => handleUpdate(props.authorDetails.published)}
            >
              {isUpdating === 'pending' ? <CircularProgress size={16} color="inherit" /> : "Update"}
            </Button>
          </div>}
          <div className="flex items-center gap-4 justify-end">
            <div className="relative group text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
               <User size={20} onClick={()=> setProfileOpen(true)}/>
            </div>
           {props.authorOrNot && <button
            onClick={() => dispatch2(togglePreviewButton())}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
            title="Toggle edit mode"
          >
            <Tooltip title='edit' placement="top-start">
            <SquarePen size={20} />
            </Tooltip>
          </button>}
          </div>
        </div>
      <div className={`${isProfileOpen ? 'visible':'invisible'} top-10 right-2`}>
        <UserProfile setProfileOpen={setProfileOpen} isProfileOpen={isProfileOpen} authorId={props.authorDetails.authorId}/>
      </div>
      {/* Editor */}
      <div className="relative w-full">
      <MainEditor
        blog={props.blog}
        editor={editor}
      />
      <div className="absolute bottom-2 right-1.5">
              <EmojiReactionToggler props={props.blog} blogId={props.blogId}/>
      </div>
      </div>
      <div ref={targetRef} className="">
      <CommentSection enablePaginationBar={isInView} blogId={props.blogId} commentCnt={props.blog.commentsCnt}/>
      </div>
      <ToastContainer/>
    </div>
  );
};