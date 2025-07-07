import { BlogCard } from "../components/BlogCard";
import { BlogsSkeleton } from "../components/BlogsSkeleton";
import { toast, ToastContainer } from "react-toastify";
import { NoBlogs } from "../components/NoBlogs";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import React, { useEffect } from "react";
import { fetchAllBlogs, setAllBlogPages } from "../features/Blogs/BlogSlice";
import { useAppDispatch } from "../hooks";

export const Blogs = React.memo(() => {
  const { isloading, AllBlogs, isMoreAllBlogs,allBlogPages, hasAllBlogFetched } = useSelector((state:RootState)=>state.BlogSlice);
  const dispatch = useAppDispatch()
  useEffect(()=>{
    async function fetch(){
      try {
         await dispatch(fetchAllBlogs()).unwrap();
     } catch (error:any) {
       toast(error)
     }
    }
    if(!hasAllBlogFetched){
    fetch()
    }
  },[allBlogPages])
  return (
    <div className="min-h-[80vh] w-full px-4 py-6 md:px-8 bg-gray-50 dark:bg-gray-950 transition-all">
      <ToastContainer />

      {isloading === 'pending' ? (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogsSkeleton key={index} />
          ))}
        </div>
      ) : AllBlogs.length === 0 ? (
        <div className=" h-screen text-center text-gray-600 dark:text-gray-300 text-lg mt-20">
          <NoBlogs />
        </div>
      ) : (
        <div className="flex min-h-screen flex-col gap-6 max-w-3xl mx-auto mt-8">
          {AllBlogs.map((val) => (
            <BlogCard
              key={val.id}
              id={val.id}
              authorName={val.author?.name}
              publishedDate={val.publishedDate}
              title={val.title}
              content={val.content}
              published={val.published}
            />
          ))}
          {isMoreAllBlogs && (
            <button
              onClick={() => dispatch(setAllBlogPages())}
              className="mx-auto mt-4 px-5 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm transition"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
});
