import { createEditor, type Descendant } from "slate";
import { MainEditor } from "./Editor/MainEditor";
import { withLinks } from "./Editor/utils/Link";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { useState } from "react";
import { SquarePen } from "lucide-react";
import { Button } from "./Button";
import { CircularProgress, Tooltip } from "@mui/material";

interface FullBlogProps {
  setBlog: React.Dispatch<React.SetStateAction<Descendant[]>>;
  blog: Descendant[];
  updateFunction: ({ published }: { published: boolean }) => void;
  isloading: boolean;
  authorOrNot: boolean;
  published: boolean;
}

export const FullBlog = (props: FullBlogProps) => {
  const [editor] = useState(() =>
    withLinks(withHistory(withReact(createEditor())))
  );
  const [toggleEdit, setToggleEdit] = useState(true);

  return (
    <div className="w-full h-full">
      {/* Top Actions */}
      {props.authorOrNot && (
        <div className="flex justify-between mb-4 items-center">
          <div className="flex gap-2">
            {!props.published && (
              <Button
                disableButton={props.isloading}
                onClick={() => props.updateFunction?.({ published: true })}
              >
                {props.isloading ? <CircularProgress size={16} /> : "Publish"}
              </Button>
            )}
            <Button
              disableButton={props.isloading}
              onClick={() =>
                props.updateFunction?.({ published: props.published })
              }
            >
              {props.isloading ? <CircularProgress size={16} /> : "Update"}
            </Button>
          </div>
          <Tooltip title='edit' placement="top-start">
          <button
            onClick={() => setToggleEdit((prev) => !prev)}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
            title="Toggle edit mode"
          >
            <SquarePen size={20} />
          </button>
          </Tooltip>
        </div>
      )}

      {/* Editor */}
      <MainEditor
        isloading={props.isloading}
        blog={props.blog}
        setBlog={props.setBlog}
        isUpdate={true}
        editor={editor}
        readonly={toggleEdit}
      />
    </div>
  );
};