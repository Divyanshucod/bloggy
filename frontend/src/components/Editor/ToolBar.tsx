import { useSlate } from "slate-react";
import {
  HEADINGS,
  TEXT_FORMAT_OPTIONS,
  TEXT_BLOCK_OPTIONS,
  RichTextAction,
} from "./constants";

import { isBlockActive, isMarkActive, toggleBlock, toggleMark } from "./utils";
import type { ElementKey, MarkKey } from "./types";
import { useState } from "react";

export const ToolBar = () => {
  const editor = useSlate();
  // const [isLink,setIsLink] = useState(false)
  // const [linkTitle,setLinkTitle] = useState('')
  // const [url,setUrl] = useState('')
  const onMarkClick = (id: RichTextAction) => {
    toggleMark(editor, id as MarkKey);
  };

  const getMarkSelectionProps = (id: RichTextAction) => {
    if (!isMarkActive(editor, id as MarkKey)) return {};
    return { background: "blue", color: "white" };
  };
  const getBlockSelectionProps = (id: RichTextAction) => {
    if (!isBlockActive(editor, id as ElementKey)) return {};
    return { background: "blue", color: "white" };
  };
  const onBlockClick = (id: RichTextAction) => {
    toggleBlock(editor, id as ElementKey);
  };
  return (
    <div className="flex flex-wrap gap-2 items-center p-2 bg-gray-100 rounded shadow mb-2 sticky top-0">
      <select
        className="border rounded px-2 py-1"
        defaultValue="paragraph"
        onChange={(e) => toggleBlock(editor, e.target.value as ElementKey)}
      >
        <option value="paragraph">Paragraph</option>
        {HEADINGS.map((val) => {
          return <option value={val}>{val}</option>;
        })}
      </select>
      <div className="flex gap-2">
        {TEXT_FORMAT_OPTIONS.map((val) => {
          return (
            <button
              onMouseDown={() => onMarkClick(val.id)}
              style={{ ...getMarkSelectionProps(val.id) }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <val.icon size={20} />
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        {TEXT_BLOCK_OPTIONS.map((val) => {
          return (
            <button
              onMouseDown={() => onBlockClick(val.id)}
              style={{ ...getBlockSelectionProps(val.id) }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <val.icon size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
