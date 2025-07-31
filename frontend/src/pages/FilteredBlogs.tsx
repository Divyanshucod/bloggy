import { BlogCard } from "../components/BlogCard";
import { BlogsSkeleton } from "../components/BlogsSkeleton";
import { toast, ToastContainer } from "react-toastify";
import { NoBlogs } from "../components/NoBlogs";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import React, { useEffect } from "react";
import { fetchFilteredBlogs } from "../features/Blogs/BlogSlice";
import { useAppDispatch } from "../hooks";
import { Pagination } from "../components/Pagination";
import { useLocation } from "react-router-dom";

export const FilteredBlogs = React.memo(() => {
  const location = useLocation();
  const searchUrl = new URLSearchParams(location.search);
  const filter = searchUrl.get("filter") || "all";
  const { isloading, filteredBlogPages, filteredBlogs } = useSelector(
    (state: RootState) => state.BlogSlice
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function fetch() {
      try {
        await dispatch(fetchFilteredBlogs({ filter })).unwrap();
      } catch (error: any) {
        toast(error);
      }
    }
    fetch();
  }, [filteredBlogPages]);
  return (
    <div className="min-h-screen w-screen px-4 py-6 md:px-8 bg-gray-50 dark:bg-gray-950 transition-all">
      <ToastContainer />

      {isloading === "pending" ? (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogsSkeleton key={index} />
          ))}
        </div>
      ) : filteredBlogs.blogs.length === 0 ? (
        <div className=" h-screen text-center text-gray-600 dark:text-gray-300 text-lg mt-20">
          <NoBlogs />
        </div>
      ) : (
        <div className="flex min-h-screen flex-col gap-6 max-w-3xl mx-auto mt-8 w-full">
          {filteredBlogs.blogs.map((val) => (
            <BlogCard
              key={val.post.id}
              id={val.post.id}
              authorName={val.post.author?.name}
              publishedDate={val.post.publishedDate}
              title={val.post.title}
              content={val.post.content}
              published={val.post.published}
            />
          ))}
          <footer className="fixed bottom-2 right-[50%] translate-x-[50%]">
            <Pagination cnt={filteredBlogs.totalBlogs} type="filteredBlogs" />
          </footer>
        </div>
      )}
    </div>
  );
});
