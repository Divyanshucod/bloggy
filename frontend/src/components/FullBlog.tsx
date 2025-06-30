
import { createEditor, type Descendant } from "slate";
import { MainEditor } from "./Editor/MainEditor";
import { withLinks } from "./Editor/utils/Link";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { useState } from "react";
import { SquarePen } from "lucide-react";

interface FullBlogProps {
  setBlog:React.Dispatch<React.SetStateAction<Descendant[]>>
  blog:Descendant[],
  updateFunction:()=>void,
  isloading:boolean
}

export const FullBlog = (props: FullBlogProps) => {
  const [editor] = useState(() => withLinks(withHistory(withReact(createEditor()))));
  const [toggleEdit,setToggleEdit] = useState(true)
  return (
     <div className="w-full h-full">
        <div>
        <button onClick={() => setToggleEdit((prev) => !prev)} className="rounded-sm shadow-sm">
          <SquarePen size={20}/>
          </button>
        </div>
        <div>
         <MainEditor isloading={props.isloading} blog={props.blog} setBlog={props.setBlog} updateFunction={props.updateFunction} isUpdate={true} editor={editor} readonly={toggleEdit}/>
        </div>
     </div>
  );
};
