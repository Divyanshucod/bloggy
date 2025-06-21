import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { BACKED_URL } from "../config";
import { toast } from "react-toastify";
interface Blog {
  title: string;
  id: string;
  content: string;
  author: {
    name: string;
  };
  publishedDate: string;
}
export const useBlog = ({ id }: { id: string }) => {
  const [isloading, setTransition] = useTransition();
  const [blog, setBlog] = useState<Blog>({
    title: "Learn security services",
    id: "6tfa6q",
    content:
      "Security services encompass a wide range of protective measures, including physical security, cybersecurity, and risk management, designed to safeguard individuals, assets, and information. These services can be delivered by individuals, private companies, or government organizations",
    author: {
      name: "Joshua",
    },
    publishedDate: "Jan 20,2023,4:16PM",
  });
  useEffect(() => {
    setTransition(async () => {
      try {
        const response = await axios.get(`${BACKED_URL}api/v1/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
          `${BACKED_URL}api/v1/blog/bulk/${pages}`
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
