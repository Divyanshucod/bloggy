import type { CreateBlogType } from "@dev0000007/medium-web";
import { useState, useTransition } from "react";
import { BACKED_URL } from "../config";
import axios from "axios";
import { toast } from "react-toastify";
import { SpinnerSkeleton } from "../components/SpinnerSkeleton";

export const BlogCreate = () => {
  const [blog, setBlog] = useState<CreateBlogType>({
    title: "",
    content: "",
  });
  const [isloading, setTransition] = useTransition();
  async function createBlog() {
    setTransition(async () => {
      try {
        const response = await axios.post(`${BACKED_URL}api/v1/blog`, blog, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success(response.data.message);
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Server is unreachable or something went wrong.");
        }
      }
    });
    setBlog({ title: "", content: "" });
  }
  return (
    <div className="w-screen flex justify-center items-center h-screen">
      <div className="w-3xl p-5 rounded-sm shadow-sm border-slate-300">
        <div>
          <div className="mb-6">
            <label htmlFor="success" className="block mb-2 text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="success"
              className="bg-green-50 border text-gray-600 w-full"
              placeholder="Title"
              onChange={(e) =>
                setBlog((prev) => ({ ...prev, title: e.target.value }))
              }
              value={blog.title}
            />
          </div>
        </div>
        <div>
          <div className="mb-6">
            <label htmlFor="success" className="block mb-2 text-sm font-medium">
              Content
            </label>
            <input
              type="text"
              id="success"
              className="bg-green-50 border text-gray-600 w-full"
              placeholder="Content"
              onChange={(e) =>
                setBlog((prev) => ({ ...prev, content: e.target.value }))
              }
              value={blog.content}
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={createBlog}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            {isloading ? <SpinnerSkeleton/> : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};
