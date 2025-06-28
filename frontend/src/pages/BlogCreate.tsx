import { useState, useTransition } from "react";
import { BACKED_URL, BACKED_URL_LOCAL } from "../config";
import axios from "axios";
import { toast } from "react-toastify";
import { RichEditor } from "../components/Editor/RichEditor";
import { Node, type Descendant } from "slate";
import { getCustomFormattedDate } from "../helperFunctions";
const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
export const BlogCreate = () => {
  const [blog, setBlog] = useState<Descendant[]>(initialValue);
  const [isloading, setTransition] = useTransition();
  async function createBlog() {
    const check = hasValue(blog)
    if(!check){
      return toast.error("Blog can't be empty")
    }
    console.log(JSON.stringify(blog));
    
    setTransition(async () => {
      try {
        const customDate = getCustomFormattedDate()
        const response = await axios.post(`${BACKED_URL_LOCAL}api/v1/blog`, {content:blog,publishedDate:customDate}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success(response.data.message);
        setBlog(initialValue)
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Server is unreachable or something went wrong.");
        }
        return;
      }
    });
  }
  return (
    <div className="w-screen flex justify-center items-center flex-col h-screen">
      <div className="w-full p-1 rounded-sm shadow-sm border-slate-300 h-full">
         <RichEditor setBlog={setBlog} isloading={isloading} handleClick={createBlog} blog={blog}/>
      </div>
    </div>
  );
};
// type DataType = {type:string,children:Descendant[]}
const hasValue = (blog:Descendant[]) => {
    const val =  blog.map(val => {
      return val.children.map(Node.string).join('')
    }).join('')
    return !!val;
}
