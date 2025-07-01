import { useContext } from "react";
import { RichEditor } from "../components/Editor/RichEditor";
import { useCreateBlog, UserInfoContext } from "../hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const BlogCreate = () => {
  const {user} = useContext(UserInfoContext)
  const navigate = useNavigate()
  if(!user){
    toast.error('Session Expired!')
    setTimeout(()=>navigate('/signup'),1000)
  }
  const { isloading, blog, setBlog, createBlog } = useCreateBlog();
  return (
    <div className="w-screen flex justify-center items-center flex-col h-screen">
      <div className="w-full p-1 rounded-sm shadow-sm border-slate-300 h-full">
        <RichEditor
          setBlog={setBlog}
          isloading={isloading}
          handleClick={createBlog}
          blog={blog}
        />
      </div>
    </div>
  );
};
