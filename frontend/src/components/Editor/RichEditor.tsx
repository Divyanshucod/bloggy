import {
  Editable,
  Slate,
  withReact,
  type RenderElementProps,
  type RenderLeafProps,
} from "slate-react";
import { ToolBar } from "./ToolBar";
import React, { useState } from "react";
import { createEditor } from "slate";
import type { CustomElement, CustomText, EditorType } from "./types";
import { toggleMark } from "./utils";
import { withHistory } from "slate-history";
const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
declare module "slate" {
  interface CustomTypes {
    Element: CustomElement;
    Editor: EditorType;
    Text: CustomText;
  }
}
const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.subscript) {
    children = <sub>{children}</sub>;
  }
  if (leaf.superscript) {
    children = <sup>{children}</sup>;
  }
  if(leaf.code){
    return (
      <pre
        {...attributes}
        className="bg-gray-100 rounded "
      >
        <code>{children}</code>
      </pre>
    );
  }
  return (
    <span
      {...attributes}
      style={{
        ...(leaf.bold && { fontWeight: "bold" }),
        ...(leaf.italic && { fontStyle: "italic" }),
        ...(leaf.underline && { textDecoration: "underline" }),
        ...(leaf.strikethrough && { textDecoration: "line-through" }),
        ...(leaf.highlight && {
          color: "black",
          padding: 2,
          background: "#f3ff63",
          border: "1px solid #c6c202",
        }),
      }}
    >
      {children}
    </span>
  );
};
const RenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote':{
        return (
            <blockquote {...attributes} style={{...style}} className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                {children}
            </blockquote>
        )
    }
    case "numbered-list": {
      return (
        <ol style={style} {...attributes} className="list-decimal list-inside">
            {children}
        </ol>
      );
    }
    case "bulleted-list": {
      return (
        <ul style={style} {...attributes} className="list-disc list-inside">
          {children}
        </ul>
      );
    }
    case "list-item": {
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    }
    case "h1": {
      return (
        <h1 style={style} {...attributes} className="text-4xl font-bold mb-2">
          {children}
        </h1>
      );
    }
    case "h2": {
      return ( 
        <h2 style={style} {...attributes}  className="text-3xl font-bold mb-2">
          {children}
        </h2>
      );
    }
    case "h3": {
      return (
        <h3 style={style} {...attributes}  className="text-2xl font-bold mb-2">
          {children}
        </h3>
      );
    }
    case "h4": {
      return (
        <h4 style={style} {...attributes}  className="text-xl font-bold mb-2">
          {children}
        </h4>
      );
    }
    case "h5": {
      return (
        <h5 style={style} {...attributes}  className="text-md font-semibold mb-2">
          {children}
        </h5>
      );
    }
    case "h6": {
      return (
        <h6 style={style} {...attributes}  className="text-sm font-semibold mb-2">
          {children}
        </h6>
      );
    }
    default: { 
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    }
  }
};
export const RichEditor = React.memo(() => {
  const [editor] = useState(withHistory(withReact(createEditor())));
  const onkeydown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const key = event?.key?.toLowerCase();
    if (key === "b" && event?.ctrlKey) {
      toggleMark(editor, "bold");
    }
    if (key === "y" && event?.ctrlKey) {
      editor.redo();
    }
    if (key === "z" && event?.ctrlKey) {
      editor.undo();
    }
  };
  return (
    <div  className="h-[500px] border rounded shadow px-4 pb-4 bg-white relative">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          console.log(value);
        }}
      >
        <ToolBar />
        <Editable
          name="Post"
          placeholder="Write Post"
          autoFocus
          renderLeaf={RenderLeaf}
          onKeyDown={onkeydown}
          renderElement={RenderElement}
          className="overflow-y-auto focus:outline-none px-3 overflow-x-hidden h-full"
/>
         <div className="mt-2">
          for the ctrl+y
         </div>
      </Slate>
    </div>
  );
});
