import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { BACKED_URL, BACKED_URL_LOCAL } from "../config";
import { toast } from "react-toastify";
import { getCustomFormattedDate, initialValue } from "../helperFunctions";
import { type CustomElementType } from '@dev0000007/medium-web';
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
export const useCreateBlog = ()=>{
const [blog, setBlog] = useState<CustomElementType[]>(initialValue);
const [isloading, setTransition] = useTransition();
async function createBlog() {
  // const check = hasValue(blog) // TODO: add a support to make sure title is given
  // if(!check){
  //   return toast.error("Blog can't be empty")
  // }
  
  setTransition(async () => {
    try {
      const customDate = getCustomFormattedDate()
      const response = await axios.post(`${BACKED_URL_LOCAL}api/v1/blog`, {content:blog,publishedDate:customDate}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(response.data.message);
      setBlog(initialValue)
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
      return;
    }
  });

}
return {
  createBlog,
  isloading,
  blog,
  setBlog
}
}
export const useUpdateBlog = ({ postId }: { postId: string })=>{
  const [blog, setBlog] = useState<CustomElementType[]>(initialValue);
  const [isUpdating, setUpdateTransition] = useTransition();
  const [isFetching, setFetchTransition] = useTransition();
  useEffect(()=>{
    async function fetchData() {
      // const check = hasValue(blog) // TODO: add a support to make sure title is given
      // if(!check){
      //   return toast.error("Blog can't be empty")
      // }
      setFetchTransition(async () => {
        try {
          const response = await axios.get(`${BACKED_URL_LOCAL}api/v1/blog/update/${postId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = response.data.post.blogJson;
          setBlog(data)
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
          return;
        }
      });
    
    }
    fetchData()
  },[postId])
  async function updateBlog() {
    // const check = hasValue(blog) // TODO: add a support to make sure title is given
    // if(!check){
    //   return toast.error("Blog can't be empty")
    // }
    setUpdateTransition(async () => {
      try {
        const response = await axios.put(`${BACKED_URL_LOCAL}api/v1/blog`, {content:blog,postId}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success(response.data.message);
        setBlog(initialValue)
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
        return;
      }
    });
  
  }
  return {
    updateBlog,
    isUpdating,
    isFetching,
    blog,
    setBlog
  }
  }
