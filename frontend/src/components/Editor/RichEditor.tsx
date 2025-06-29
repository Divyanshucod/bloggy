import {
  Editable,
  Slate,
  withReact,
  type RenderElementProps,
  type RenderLeafProps,
} from "slate-react";
import { ToolBar } from "./ToolBar";
import React, { useEffect, useState } from "react";
import { createEditor, Editor, Element, Node, Transforms, type Descendant } from "slate";
import type { CustomElement, CustomText, EditorType } from "./types";
import { toggleMark } from "./utils";
import { withHistory } from "slate-history";
declare module "slate" {
  interface CustomTypes {
    Element: CustomElement;
    Editor: EditorType;
    Text: CustomText;
  }
}

const RenderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.subscript) children = <sub>{children}</sub>;
  if (leaf.superscript) children = <sup>{children}</sup>;
  if (leaf.code)
    return (
      <pre {...attributes} className="bg-gray-100 rounded">
        <code>{children}</code>
      </pre>
    );
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

const RenderElement = ({ attributes, children, element }: RenderElementProps) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "link":
      return (
        <a
          {...attributes}
          href={element.url}
          className="underline text-blue-600 cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { if (e.metaKey) { window.open(element.url, '_blank') } }}
        >
          {children}
        </a>
      );
    case "block-quote":
      return (
        <blockquote
          {...attributes}
          style={{ ...style }}
          className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
        >
          {children}
        </blockquote>
      );
    case "numbered-list":
      return (
        <ol {...attributes} style={style} className="list-decimal list-inside">
          {children}
        </ol>
      );
    case "bulleted-list":
      return (
        <ul {...attributes} style={style} className="list-disc list-inside">
          {children}
        </ul>
      );
    case "list-item":
      return (
        <li {...attributes} style={style}>
          {children}
        </li>
      );
    case "h1":
      return (
        <h1 {...attributes} style={style} className="text-4xl font-bold mb-2">
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 {...attributes} style={style} className="text-3xl font-bold mb-2">
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 {...attributes} style={style} className="text-2xl font-bold mb-2">
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 {...attributes} style={style} className="text-xl font-bold mb-2">
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 {...attributes} style={style} className="text-md font-semibold mb-2">
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6 {...attributes} style={style} className="text-sm font-semibold mb-2">
          {children}
        </h6>
      );
    case "image":
      return (
        <div style={{display:'flex', justifyContent:element.align , width:'100%'}}>
            <img
              src={element.url}
              alt="uploaded"
              className="h-[300px] w-[300px] rounded"
              {...attributes} style={{textAlign: element.align}}
            />
            </div>
      );
    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
};
const withLinks = (editor:EditorType) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  return editor;
};
export const RichEditor = React.memo(({setBlog,isloading,handleClick,blog,updateorcreate=false}:{setBlog:React.Dispatch<React.SetStateAction<Descendant[]>>,isloading:boolean,handleClick:()=>void,blog:Descendant[],updateorcreate:boolean}) => {
  const [editor] = useState(() => withLinks(withHistory(withReact(createEditor()))));
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const key = event?.key?.toLowerCase();
    if (key === "b" && event.ctrlKey) toggleMark(editor, "bold");
    if (key === "y" && event.ctrlKey) editor.redo();
    if (key === "z" && event.ctrlKey) editor.undo();
  };
  
  return (
    <div className="h-full rounded px-4 pb-4 bg-white relative">
      <Slate
        editor={editor}
        initialValue={blog}
        onChange={(value) => setBlog(value) }
      >
        <ToolBar isloading={isloading} handleClick={handleClick} updateorcreate={updateorcreate}/>
        <div className="h-full">
           <Editable
          name="Post"
          placeholder="Title"
          autoFocus
          renderLeaf={RenderLeaf}
          onKeyDown={onKeyDown}
          renderElement={RenderElement}
          className="overflow-y-auto focus:outline-none px-3 overflow-x-hidden h-full"
        />
        </div>
      </Slate>
    </div>
  );
});

