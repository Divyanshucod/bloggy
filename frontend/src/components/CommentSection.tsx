import { CommentCard } from "./CommentCard"

export const CommentSection = ()=>{
   return <div className="pt-15 w-screen flex flex-col items-center">
        <div className="w-[70%] flex items-center flex-col">
        <div>Enter Your Comment</div>
        <div className="w-full flex justify-center items-center">
            <CommentCard/>
        </div>
        </div>
    </div>
}