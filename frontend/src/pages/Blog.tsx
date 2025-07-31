import { useParams } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { FullBlog } from "../components/FullBlog";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { fetchBlogById } from "../features/Blogs/BlogSlice";
import { toast } from "react-toastify";
const Blog = () => {
  const { id } = useParams();
  const { isloading, Blog, authorDetails } = useSelector(
    (state: RootState) => state.BlogSlice
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function fetch() {
      try {
        await dispatch(fetchBlogById({ blogId: id || "" })).unwrap();
      } catch (error: any) {
        toast.error(error);
      }
    }
    fetch();
  }, []);

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 bg-white dark:bg-gray-950 transition">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Blog content */}
        <div className="lg:col-span-12">
          {isloading === "pending" ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
              <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-lg mt-4" />
            </div>
          ) : (
            <FullBlog
              blog={Blog}
              authorOrNot={authorDetails.authorOrNot}
              authorDetails={authorDetails}
              blogId={id || ""}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
