import type { CreateBlogType } from "@dev0000007/medium-web";
import { useState, useTransition } from "react";
import { BACKED_URL } from "../config";
import axios from "axios";
import { toast } from "react-toastify";
import { SpinnerSkeleton } from "../components/SpinnerSkeleton";
import { RichEditor } from "../components/Editor/RichEditor";

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
    <div className="w-screen flex justify-center items-center flex-col">
      <div className="w-full p-1 rounded-sm shadow-sm border-slate-300">
         <RichEditor/>
      </div>
    </div>
  );
};
