import {  useParams } from "react-router-dom";
import {  useUpdateBlog } from "../hooks";
import { FullBlog } from "../components/FullBlog";
import { AuthorCard } from "../components/AuthorCard";

const Blog = () => {
  const { id } = useParams();
  const { isloading, blog, setBlog, updateBlog, isUpdating, details } =
    useUpdateBlog({ postId: id || "" });

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 bg-white dark:bg-gray-950 transition">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Blog content */}
        <div className="lg:col-span-8">
          {isloading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
              <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-lg mt-4" />
            </div>
          ) : (
            <FullBlog
              blog={blog}
              setBlog={setBlog}
              isloading={isUpdating}
              updateFunction={updateBlog}
              authorOrNot={details.authorOrNot}
              published={details.published}
            />
          )}
        </div>

        {/* Author Sidebar */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 h-fit">
            {isloading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-400 dark:bg-gray-600 rounded-full" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
                <div className="space-y-2 mt-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6" />
                </div>
              </div>
            ) : (
              <AuthorCard
                authorName={details.author.name}
                bioData="I love playing games and I love coding and solving real world problems. I am a fullstack developer too."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
