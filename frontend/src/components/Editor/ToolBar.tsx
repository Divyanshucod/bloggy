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
import {useState } from "react";
import { Button } from "../Button";
import { CircularProgress } from "@mui/material";
import { ToolBarButton, type TextFormateButtonProps } from "../ToolBarButton";
import { LinkComp } from "../LinkComponent";
interface toolbarType {
  isloading: boolean;
  handleClick?: ({ createDraft }: { createDraft: boolean }) => void;
  isUpdate?: boolean;
}
export const ToolBar = (props: toolbarType) => {
  const editor = useSlate();
  const [mode, setMode] = useState<"none" | "link">("none");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const onBlockClick = (id: RichTextAction) => {
    if (id === "link") {
      setMode("link");
      setError("");
    } else {
      toggleBlock(editor, id as ElementKey);
    }
  };
  return (
    <>
      {mode === "link" && (
         <LinkComp props={
          {setError,url,setMode,setUrl,editor,error}
         } />
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
                {val.charAt(0).toUpperCase() + val.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Text Format Options */}
          <div className="flex gap-1">
            {TEXT_FORMAT_OPTIONS.map((val:TextFormateButtonProps) => (
               <ToolBarButton props={val} onClick={() => toggleMark(editor,val.id as MarkKey)} isActive={isMarkActive(editor,val.id as MarkKey)}/>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex gap-1">
                {TEXT_BLOCK_OPTIONS.map((val)=>(
                  <ToolBarButton props={val} onClick={()=> onBlockClick(val.id)} isActive={isBlockActive(editor, val.id as ElementKey)} />
                ))}
          </div>
        </div>
        <div className="flex gap-2">
          {!props.isUpdate ? (
            <Button
              disableButton={props.isloading}
              onClick={() => props.handleClick?.({ createDraft: false })}
            >
              {props.isloading ? <CircularProgress size={10} /> : "Draft"}
            </Button>
          ) : null}
           {props.isUpdate ? null : <Button
            disableButton={props.isloading}
            onClick={() =>
               props.handleClick?.({ createDraft: true })
            }
          >
            {props.isloading ? (
              <CircularProgress size={10} />
            ) : (
              "Publish"
            )}
          </Button>}
        </div>
      </div>
    </>
  );
};
