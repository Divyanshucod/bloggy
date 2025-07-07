import { BlogCard } from "../components/BlogCard";
import { useAppDispatch } from "../hooks";
import { BlogsSkeleton } from "../components/BlogsSkeleton";
import { toast, ToastContainer } from "react-toastify";
import { NoBlogs } from "../components/NoBlogs";
import {useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserBlogs, setUserPages } from "../features/Blogs/BlogSlice";
import type { RootState } from "../store";

export const MyBlogs = () => {
   const { isloading,UserBlogs, isMoreUserBlogs ,userBlogsPage, hasUserBlogFetched} = useSelector((state:RootState)=>state.BlogSlice);
  const dispatch = useAppDispatch()
  useEffect(()=>{
    async function fetch(){
      try {
         await dispatch(fetchUserBlogs()).unwrap()
     } catch (error:any) {
       toast.error(error)
     }
    }
    if(!hasUserBlogFetched){
    fetch()
    }
  },[userBlogsPage])

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 bg-white dark:bg-gray-950 transition">
      <ToastContainer />
      {isloading === 'pending' ? (
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogsSkeleton key={index} />
          ))}
        </div>
      ) : UserBlogs.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg mt-20">
          <NoBlogs />
        </div> ) : (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto mt-8">
          {UserBlogs.map((val) => (
            <BlogCard
              key={val.id}
              id={val.id}
              authorName={val.author.name}
              publishedDate={val.publishedDate}
              title={val.title}
              content={val.content}
              isMyBlogs={true}
              published={val.published}
            />
          ))}

          {isMoreUserBlogs && (
            <button
              onClick={() =>dispatch(setUserPages())}
              className="mx-auto mt-4 px-5 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm transition"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};