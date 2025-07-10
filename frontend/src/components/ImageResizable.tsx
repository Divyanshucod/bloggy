
import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Transforms} from "slate";
import { ReactEditor, useSlate, type RenderElementProps } from "slate-react";
import type { RootState } from "../store";
import CloseIcon from '@mui/icons-material/Close';
import { deleteImage } from "../helperFunctions";


export const ImageResizable = React.memo(({
  attributes,
  element
}: RenderElementProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(200);
  const editor = useSlate();
  const preview = useSelector((state:RootState) =>state.PreviewSlice )
  const [isResizing, setIsResizing] = useState(false);
  const path = ReactEditor.findPath(editor, element)
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const containerLeft = containerRef.current.getBoundingClientRect().left;
    const newWidth = e.clientX - containerLeft;

    if (newWidth > 50) {
      setWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);
  console.log(preview);
  
  return (
    <div
      ref={containerRef}
      className="relative border border-gray-400 rounded-md overflow-hidden group"
      style={{ width }}
      contentEditable={false}
    >
     {!preview.value ? <button
        onClick={() => {
          deleteImage([element.url || ""])
          Transforms.removeNodes(editor, { at: path })
        }}
        className="absolute top-1 right-1 z-10 text-white opacity-50 bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md group-hover:opacity-100 transition-opacity"
      >
      <CloseIcon/>
      </button> : null}
      <img
        src={element.url}
        alt="Resizable"
        className="w-full h-auto block select-none"
        {...  attributes}
      />

      {/* Right Resize Handle */}
      <div
        onMouseDown={startResizing}
        className="absolute top-0 right-0 h-full w-2 cursor-ew-resize bg-blue-500 opacity-50 hover:opacity-100"
      />
    </div>
  );
});
