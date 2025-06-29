import { RichEditor } from "../components/Editor/RichEditor";
import { useCreateBlog } from "../hooks";

export const BlogCreate = () => {
  const {isloading,blog,setBlog,createBlog} = useCreateBlog()
  return (
    <div className="w-screen flex justify-center items-center flex-col h-screen">
      <div className="w-full p-1 rounded-sm shadow-sm border-slate-300 h-full"> 
         <RichEditor setBlog={setBlog} isloading={isloading} handleClick={createBlog} blog={blog} updateorcreate={false}/>
      </div>
    </div>
    
  );
};
