import type { Descendant } from "slate";
import type { EditorType } from "./types";
import { Editable, Slate } from "slate-react";
import { RenderLeaf } from "./utils/RenderLeaf";
import { onKeyDown } from "./utils/keyBinding";
import { RenderElement } from "./utils/RenderElements";
import { ToolBar } from "./ToolBar";
import { Eye } from "lucide-react";
import { useState } from "react";

interface editorType {
  setBlog: React.Dispatch<React.SetStateAction<Descendant[]>>;
  isloading: boolean;
  handleClick?: ({ createDraft }: { createDraft: boolean }) => void;
  blog: Descendant[];
  editor: EditorType;
  updateFunction?: () => void;
  isUpdate?: boolean;
  readonly: boolean;
}

export const MainEditor = (props: editorType) => {
  const [togglePreview, setTogglePreview] = useState(props.readonly);

  return (
    <div className="h-full rounded px-4 pb-4 bg-white relative">
      <Slate
        editor={props.editor}
        initialValue={props.blog}
        onChange={(value) => props.setBlog(value)}
      >
        {(props.isUpdate ? !props.readonly : !togglePreview) ? (
          <ToolBar
            isloading={props.isloading}
            handleClick={props.handleClick ?? (() => {})}
            updateFunction={props.updateFunction}
            isUpdate={props.isUpdate}
          />
        ) : null}
        <div className="h-full">
          <Editable
            readOnly={props.isUpdate ? props.readonly : togglePreview}
            name="Post"
            placeholder="Title"
            autoFocus
            renderLeaf={RenderLeaf}
            onKeyDown={(event) => onKeyDown({ event, editor: props.editor })}
            renderElement={RenderElement}
            className="overflow-y-auto focus:outline-none px-3 overflow-x-hidden h-full"
          />
        </div>
        {!props.isUpdate ? (
          <button
            onClick={() => setTogglePreview(!togglePreview)}
            className=" fixed right-5 top-52 rounded-sm shadow-sm"
          >
            <Eye size={20} />
          </button>
        ) : null}
      </Slate>
    </div>
  );
};
