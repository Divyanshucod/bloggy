import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { BlogsSkeleton } from "../components/BlogsSkeleton";
import { ToastContainer } from "react-toastify";
import { NoBlogs } from "../components/NoBlogs";

export const Blogs = () => {
  const { isloading, blogs, setPages, isMoreBlog } = useBlogs();

  return (
    <div className="min-h-[80vh] w-full px-4 py-6 md:px-8 bg-gray-50 dark:bg-gray-950 transition-all">
      <ToastContainer />

      {isloading ? (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogsSkeleton key={index} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300 text-lg mt-20">
          <NoBlogs />
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto mt-8">
          {blogs.map((val) => (
            <BlogCard
              key={val.id}
              id={val.id}
              authorName={val.author.name}
              publishedDate={val.publishedDate}
              title={val.title}
              content={val.content}
              published={val.published}
            />
          ))}
          {isMoreBlog && (
            <button
              onClick={() => setPages((prev) => prev + 1)}
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
