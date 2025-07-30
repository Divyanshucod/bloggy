import { BlogCard } from "../components/BlogCard";
import { BlogsSkeleton } from "../components/BlogsSkeleton";
import { toast, ToastContainer } from "react-toastify";
import { NoBlogs } from "../components/NoBlogs";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import React, { useEffect } from "react";
import { fetchAllBlogs } from "../features/Blogs/BlogSlice";
import { useAppDispatch } from "../hooks";
import { Pagination } from "../components/Pagination";

export const Blogs = React.memo(() => {
  const { isloading, AllBlogs,allBlogPages, hasAllBlogFetched } = useSelector((state:RootState)=>state.BlogSlice);
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
    <div className="min-h-screen w-screen px-4 py-6 md:px-8 bg-gray-50 dark:bg-gray-950 transition-all">
      <ToastContainer />

      {isloading === 'pending' ? (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogsSkeleton key={index} />
          ))}
        </div>
      ) : AllBlogs.blogs.length === 0 ? (
        <div className=" h-screen text-center text-gray-600 dark:text-gray-300 text-lg mt-20">
          <NoBlogs />
        </div>
      ) : (
        
        <div className="flex min-h-screen flex-col gap-6 max-w-3xl mx-auto mt-8 w-full">
          {AllBlogs.blogs.map((val) => (
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
          <footer className="fixed bottom-2 right-[50%] translate-x-[50%]">
        <Pagination cnt={AllBlogs.totalBlogs} type="blogs"/>
      </footer>
        </div>
      )}
    </div>
  );
});
