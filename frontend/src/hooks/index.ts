import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { BACKED_URL, BACKED_URL_LOCAL } from "../config";
import { toast } from "react-toastify";
interface Blog {
  id: string;
  htmlContent: string;
  publishedDate:string;
  author: {
    name: string;
  };
}
export const useBlog = ({ id }: { id: string }) => {
  const [isloading, setTransition] = useTransition();
  const [blog, setBlog] = useState<Blog>({
    id: "6tfa6q",
    publishedDate:"Jan 23, 2024, 4:00 AM",
    htmlContent:"<div>Security services encompass a wide range of protective measures, including physical security, cybersecurity, and risk management, designed to safeguard individuals, assets, and information. These services can be delivered by individuals, private companies, or government organizations</div>",
    author: {
      name: "Joshua",
    },
  });
  useEffect(() => {
    setTransition(async () => {
      try {
        const response = await axios.get(`${BACKED_URL_LOCAL}api/v1/blog/${id}`, {
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        });
        setBlog(response.data.post);
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
  }, [id]);
  return {
    isloading,
    blog,
  };
};
export const useBlogs = () => {
  const [isloading, setTransition] = useTransition();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pages, setPages] = useState(0);
  useEffect(() => {
    setTransition(async () => {
      try {
        const response = await axios.get(
          `${BACKED_URL_LOCAL}api/v1/blog/bulk/${pages}`
        );
        setBlogs((prev) => [...prev, ...response.data.posts]);
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
  }, [pages]);
  return {
    isloading,
    blogs,
    setPages,
  };
};
