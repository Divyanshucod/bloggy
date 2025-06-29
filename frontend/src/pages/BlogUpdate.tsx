import { useParams } from "react-router"
import { RichEditor } from "../components/Editor/RichEditor"
import { useUpdateBlog } from "../hooks"

export const BlogUpdate = ()=>{
    const {id} = useParams()
    const {isFetching,isUpdating,blog,setBlog,updateBlog} = useUpdateBlog({postId:id || ""})
   return  <div className="w-screen flex justify-center items-center flex-col h-screen">
   <div className="w-full p-1 rounded-sm shadow-sm border-slate-300 h-full">
   {isFetching ? <div>Loading...</div> :
      <RichEditor setBlog={setBlog} isloading={isUpdating} handleClick={updateBlog} blog={blog} updateorcreate={true}/> }
   </div>
 </div>
}