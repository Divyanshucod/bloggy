import { useSlate } from "slate-react";
import {
  HEADINGS,
  TEXT_FORMAT_OPTIONS,
  TEXT_BLOCK_OPTIONS,
  RichTextAction,
} from "./constants";
import {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from "./utils";
import type { ElementKey, MarkKey } from "./types";
import { useState } from "react";
import { Button } from "../Button";
import { CircularProgress } from "@mui/material";
import { ToolBarButton, type TextFormateButtonProps } from "../ToolBarButton";
import { LinkComp } from "../LinkComponent";
import { useSelector } from "react-redux";
import { createBlog } from "../../features/Blogs/BlogSlice";
import { toast } from "react-toastify";
import type { RootState } from "../../store";
import { useAppDispatch } from "../../hooks";
import { checkBlog } from "../../helperFunctions";
import { ImageModal } from "../ImageModal";
export const ToolBar = () => {
  const dispatch = useAppDispatch()
  const {isPublishing_drafting,BlogToCreate} = useSelector((state:RootState)=>state.BlogSlice)
  const editor = useSlate();
  const [mode, setMode] = useState<"none" | "link">("none");
  const [isImage,setIsImage] = useState(false)
  const preview = useSelector((state:RootState) => state.PreviewSlice)
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState("");
  const onBlockClick = (id: RichTextAction) => {
    if (id === "link") {
      setMode("link");
      setError("");
    } else {
      toggleBlock(editor, id as ElementKey);
    }
  };
  const handleDraft = async()=>{
    try {
      if(checkBlog(BlogToCreate).length === 0){
        toast.error("Blog can't be empty!");
        return;
      }
      const res = await dispatch(createBlog({ createDraft: false })).unwrap()
      toast.success(res)
      window.location.reload()
    } catch (error:any) {
      toast.error(error)
    }
  }
  const handlePublish = async()=>{
    try {
      console.log(BlogToCreate);
      
      const val = checkBlog(BlogToCreate)
      if(val.length === 0){
        toast.error("Blog can't be empty!");
        return;
      }
      const res = await dispatch(createBlog({ createDraft: true })).unwrap()
      toast.success(res)
      window.location.reload()
    } catch (error:any) {
      toast.error(error)
    }
  }
  return (
    <>
      {mode === "link" && (
         <LinkComp props={
          {setError,url:linkUrl,setMode,setUrl:setLinkUrl,editor,error}
         } />
      )}
      {isImage && (
         <ImageModal setIsImage={setIsImage} editor={editor}/>
      )}
      <div className="flex gap-2 items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-4 justify-between overflow-x-auto dark:bg-slate-900 dark:text-white dark:border-gray-800">
        <div className="flex gap-2 items-center">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white  dark:border-gray-800"
            defaultValue="paragraph"
            onChange={(e) => toggleBlock(editor, e.target.value as ElementKey)}
          >
             <option value="paragraph">Paragraph</option>
            {HEADINGS.map((val) => (
              <option key={val} value={val}>
                {val.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Text Format Options */}
          <div className="flex gap-1">
            {TEXT_FORMAT_OPTIONS.map((val:TextFormateButtonProps) => (
               <ToolBarButton key={val.id} props={val} onClick={() => toggleMark(editor,val.id as MarkKey)} isActive={isMarkActive(editor,val.id as MarkKey)}/>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex gap-1">
                {TEXT_BLOCK_OPTIONS.map((val)=>(
                  <ToolBarButton key={val.id} props={val} onClick={()=>  {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    val.label === 'Image' ? setIsImage(true) : onBlockClick(val.id)
                  }} isActive={isBlockActive(editor, val.id as ElementKey)} />
                ))}
          </div>
        </div>
        <div className="flex gap-2">
          {!preview.isForUpdateBlog ? (
            <Button
              disableButton={isPublishing_drafting === 'pending'}
              onClick={handleDraft}
            >
              {isPublishing_drafting === 'pending' ? <CircularProgress size={10} color="inherit" /> : "Draft"}
            </Button>
          ) : null}
           {preview.isForUpdateBlog ? null : <Button
            disableButton={isPublishing_drafting === 'pending'}
            onClick={handlePublish}
          >
            {isPublishing_drafting === 'pending' ? (
              <CircularProgress color="inherit" size={10} />
            ) : (
              "Publish"
            )}
          </Button>}
        </div>
      </div>
    </>
  );
};
