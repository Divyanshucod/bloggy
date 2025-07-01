import { createEditor, type Descendant } from "slate";
import { MainEditor } from "./Editor/MainEditor";
import { withLinks } from "./Editor/utils/Link";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { useState } from "react";
import { SquarePen } from "lucide-react";
import { Button } from "./Button";
import { CircularProgress } from "@mui/material";

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
      <div className="flex justify-between">
        <div className="flex gap-2">
          {!props.published ? (
            <Button
              disableButton={props.isloading}
              onClick={() => props.updateFunction?.({ published: true })}
              color="#5df542"
            >
              {props.isloading ? <CircularProgress size={10} /> : "Publish"}
            </Button>
          ) : null}

          <Button
            disableButton={props.isloading}
            onClick={() =>
              props.updateFunction?.({ published: props.published })
            }
            color="#5df542"
          >
            {props.isloading ? <CircularProgress size={10} /> : "Update"}
          </Button>
        </div>
        <div className="w-full flex justify-end pr-4">
          {props.authorOrNot ? (
            <button
              onClick={() => setToggleEdit((prev) => !prev)}
              className="rounded-sm shadow-sm"
            >
              <SquarePen size={20} />
            </button>
          ) : null}
        </div>
      </div>
      <div>
        <MainEditor
          isloading={props.isloading}
          blog={props.blog}
          setBlog={props.setBlog}
          updateFunction={props.updateFunction}
          isUpdate={true}
          editor={editor}
          readonly={toggleEdit}
        />
      </div>
    </div>
  );
};
