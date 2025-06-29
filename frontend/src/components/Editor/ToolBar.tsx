
import { useSlate } from "slate-react";
import {
  HEADINGS,
  TEXT_FORMAT_OPTIONS,
  TEXT_BLOCK_OPTIONS,
  RichTextAction,
} from "./constants";
import {
  insertImage,
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
  wrapLink,
  isLinkActive,
  isInImageBlock,
  getCurrentImageAlignment,
  setImageAlignment,
} from "./utils";
import type { ElementKey, MarkKey, AlignKey } from "./types";
import { useRef, useState, useEffect } from "react";
import { Button } from "../Button";
import { CircularProgress } from "@mui/material";

export const ToolBar = ({isloading,handleClick,updateorcreate}:{isloading:boolean,handleClick:()=>void,updateorcreate:boolean}) => {
  const editor = useSlate();
  const [mode, setMode] = useState<"none" | "link">("none");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isInImage, setIsInImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if cursor is in image block
  useEffect(() => {
    setIsInImage(isInImageBlock(editor));
  }, [editor.selection]);

  const onMarkClick = (id: RichTextAction) => toggleMark(editor, id as MarkKey);

  const getMarkSelectionProps = (id: RichTextAction) =>
    isMarkActive(editor, id as MarkKey) 
      ? { backgroundColor: "#3b82f6", color: "white" } 
      : {};

  const getBlockSelectionProps = (id: RichTextAction) => {
    if (isInImage && ["left", "center", "right", "justify"].includes(id)) {
      const currentAlign = getCurrentImageAlignment(editor);
      return currentAlign === id 
        ? { backgroundColor: "#3b82f6", color: "white" } 
        : {};
    }
    return isBlockActive(editor, id as ElementKey) 
      ? { backgroundColor: "#3b82f6", color: "white" } 
      : {};
  };

  const onBlockClick = (id: RichTextAction) => {
    if (id === "link") {
      setMode("link");
      setError("");
    } else if (id === "image") {
      fileInputRef.current?.click();
    } else if (isInImage && ["left", "center", "right", "justify"].includes(id)) {
      // Handle image alignment
      setImageAlignment(editor, id as AlignKey);
    } else {
      toggleBlock(editor, id as ElementKey);
    }
  };

  const handleLinkSubmit = () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    const success = wrapLink(editor, url.trim());
    if (!success) {
      setError("Invalid URL or no text selected. Please select text first or enter a valid URL.");
    } else {
      setUrl("");
      setMode("none");
      setError("");
    }
  };

  const handleLinkCancel = () => {
    setUrl("");
    setMode("none");
    setError("");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          insertImage(editor, result);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLinkSubmit();
    } else if (e.key === 'Escape') {
      handleLinkCancel();
    }
  };

  return (
    <>
      {mode === "link" && (
        <div className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm absolute top-[50%] left-[50%] -translate-[50%] z-20 h-[30%] w-[50%] flex justify-center items-center">
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter URL
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <button 
                onClick={handleLinkSubmit} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Add Link
              </button>
              <button 
                onClick={handleLinkCancel} 
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className=" flex flex-wrap gap-2 items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-4 sticky top-15 z-10 justify-between">
        {/* Headings Dropdown */}
        <div className="flex gap-2 items-center">
        <select
          className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          defaultValue="paragraph"
          onChange={(e) => toggleBlock(editor, e.target.value as ElementKey)}
          disabled={isInImage}
        >
          <option value="paragraph">Paragraph</option>
          {HEADINGS.map((val) => (
            <option key={val} value={val}>
              {val.charAt(0).toUpperCase() + val.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Text Format Options */}
        <div className="flex gap-1">
          {TEXT_FORMAT_OPTIONS.map((val) => (
            <button
              key={val.id}
              onMouseDown={(e) => {
                e.preventDefault();
                onMarkClick(val.id);
              }}
              style={getMarkSelectionProps(val.id)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={val.id}
              disabled={isInImage}
            >
              <val.icon size={18} />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Block Options */}
        <div className="flex gap-1">
          {TEXT_BLOCK_OPTIONS.map((val) => {
            // Show alignment buttons differently when in image
            const isAlignButton = ["left", "center", "right", "justify"].includes(val.id);
            const showButton = !isInImage || isAlignButton;
            
            if (!showButton) return null;

            return (
              <button
                key={val.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onBlockClick(val.id);
                }}
                style={getBlockSelectionProps(val.id)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                title={isInImage && isAlignButton ? `Align image ${val.id}` : val.id}
              >
                <val.icon size={18} />
              </button>
            );
          })}
        </div>
        </div>
        {/* Image status indicator */}
          <Button disableButton={isloading} onClick={handleClick} color="#5df542">{isloading ? <CircularProgress size={10} /> : updateorcreate ? "Update" : "Publish"}</Button>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageSelect}
        />
      </div>
    </>
  );
};


