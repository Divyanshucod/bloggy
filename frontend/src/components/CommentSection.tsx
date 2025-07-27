import { useEffect } from "react";
import { Button } from "./Button"
import { CommentCard } from "./CommentCard"
import { Pagination } from "./Pagination"
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useAppDispatch } from "../hooks";
import { createComment, fetchComments } from "../features/comment/CommentSlice";
import { toast } from "react-toastify";


export const CommentSection = ({blogId,enablePaginationBar=true}:{blogId:string,enablePaginationBar:boolean}) => {
  const { pageNo,} = useSelector((state:RootState)=>state.CommentSlice);
  const { comments, isLoading,isCreatingComment} = useSelector((state:RootState)=>state.CommentSlice);
  const dispatch2 = useAppDispatch()
  useEffect(()=>{
    async function fetch(){
      try {
          const res = await dispatch2(fetchComments({blogId:blogId})).unwrap()
          toast.success(res)
        } catch (error:any) {
          toast.error(error)
        }
  }
  fetch();
  },[pageNo])
  async function handleClick(): void {
      //create comment
      try {
         const res = await dispatch2(createComment({blogId:blogId})).unwrap()
         toast.success(res)
      } catch (error:any) {
        toast.error(error)
      }
  }
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-white dark:bg-gray-900 px-4 py-20 relative">
      {/* Comment Input */}
      <div className="w-full max-w-3xl rounded-xl bg-gray-100 dark:bg-gray-800 p-4 mb-6 shadow">
        <textarea
          className="w-full bg-transparent resize-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 h-28"
          placeholder="Add comment..."
        ></textarea>
        <div className="flex justify-end">
          <Button
            onClick={handleClick}
            disableButton={isCreatingComment === 'pending'}
          >
            {isCreatingComment === 'pending' ? 'Adding...' : 'Add Comment'}
          </Button>
        </div>
      </div>
      <hr className="my-6 border-t border-gray-300 dark:border-gray-600 w-full max-w-3xl" />

      {/* Comments Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4 px-2 dark:text-white">
        <h3 className="font-semibold text-lg">Comments <span className="ml-1 text-green-600">(25)</span></h3>
        <select className="border px-2 py-1 rounded dark:bg-gray-800 dark:text-white">
          <option value="recent">Most Recent</option>
          <option value="upvote">Most Liked</option>
        </select>
      </div>

      {/* Comment List */}
      <div className="w-full max-w-3xl space-y-6">
      {isLoading === 'pending' ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-[200px] bg-gray-200 dark:bg-gray-800 rounded-lg mt-4" />
            </div>
          ) : (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment.comment} commentor={comment.commentor} createdAt={comment.createdAt} currentUserReactions={comment.currentUserReactions} reactionsCnt={comment.reactionsCnt} id={comment.id}/>
            ))
          )}
      </div>
      {enablePaginationBar &&  <footer className="fixed bottom-2 flex justify-center items-end">
        <Pagination cnt={20} type="comments"/>
      </footer>}
    </div>
  )
}
