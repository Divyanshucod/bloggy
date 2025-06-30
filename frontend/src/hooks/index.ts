import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { BACKED_URL, BACKED_URL_LOCAL } from "../config";
import { toast } from "react-toastify";
import {initialValue } from "../helperFunctions";
import {type CustomElementType } from '@dev0000007/medium-web';
interface Blogs {
  id: string;
  title:string,
  content:string,
  publishedDate:string;
  author: {
    name: string;
  };
}
export const useBlogs = () => {
  const [isloading, setTransition] = useTransition();
  const [blogs, setBlogs] = useState<Blogs[]>([]);
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
async function createBlog({createDraft}:{createDraft:boolean}) {
  // const check = hasValue(blog) // TODO: add a support to make sure title is given
  // if(!check){
  //   return toast.error("Blog can't be empty")
  // }
  
  setTransition(async () => {
    try {
      const response = await axios.post(`${BACKED_URL_LOCAL}api/v1/blog`, {content:blog,published:createDraft}, {
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
   //TODO: Navigate to /my-daft page or /blogs /published
}
return {
  createBlog,
  isloading,
  blog,
  setBlog,
}
}
export const useUpdateBlog = ({ postId }: { postId: string })=>{
  const [blog, setBlog] = useState<CustomElementType[]>(initialValue);
  const [isUpdating, setUpdateTransition] = useTransition();
  const [isloading, setFetchTransition] = useTransition();
  const [details,setDetails] = useState({
    id:'',
    publishedDate:'2025-06-21T15:08:03.091+00:00',
    author:{
      name:'Dev'
    }
  })
  useEffect(()=>{
    async function fetchData() {
      // const check = hasValue(blog) // TODO: add a support to make sure title is given
      // if(!check){
      //   return toast.error("Blog can't be empty")
      // }
      setFetchTransition(async () => {
        try {
          const response = await axios.get(`${BACKED_URL_LOCAL}api/v1/blog/${postId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = response.data.post.blogJson;
          setBlog(data)
          setDetails({
            id:response.data.post.id,
            publishedDate:response.data.post.id,
            author: response.data.post.author
          })
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
    isloading,
    blog,
    setBlog,
    details
  }
  }
