import axios from "axios";
import {
  createContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { BACKED_URL, BACKED_URL_LOCAL } from "../config";
import { toast } from "react-toastify";
import handleError, { checkAuthor, initialValue } from "../helperFunctions";
import { type CustomElementType } from "@dev0000007/medium-web";
interface Blogs {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  published: boolean;
  author: {
    name: string;
  };
}
export const useMyBlogs = () => {
  const [isloading, setTransition] = useTransition();
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [pages, setPages] = useState(0);
  const [isMoreBlog,setIsMoreBlog] = useState(true)
  useEffect(() => {
    setTransition(async () => {
      try {
        const response = await axios.get(
          `${BACKED_URL_LOCAL}api/v1/blog/user/${pages}`,{
            headers:{
              Authorization:localStorage.getItem('token')
            }
          }
        );
        if(response.data.posts.length < 3){
          setIsMoreBlog(false)
        }
        setBlogs((prev) => [...prev, ...response.data.posts]);
      } catch (error: any) {
        return handleError(error);
      }
    });
  }, [pages]);
  return {
    isloading,
    blogs,
    setPages,
    isMoreBlog,
  };
};
export const useBlogs = () => {
  const [isloading, setTransition] = useTransition();
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [pages, setPages] = useState(0);
  const [isMoreBlog,setIsMoreBlog] = useState(true)
  useEffect(() => {
    setTransition(async () => {
      try {
        const response = await axios.get(
          `${BACKED_URL_LOCAL}api/v1/blog/bulk/${pages}`
        );
        if(response.data.posts.length < 3){
          setIsMoreBlog(false)
        }
        setBlogs((prev) => [...prev, ...response.data.posts]);
      } catch (error: any) {
        return handleError(error);
      }
    });
  }, [pages]);
  return {
    isloading,
    blogs,
    setPages,
    isMoreBlog,
    setIsMoreBlog
  };
};
export const useCreateBlog = () => {
  const [blog, setBlog] = useState<CustomElementType[]>(initialValue);
  const [isloading, setTransition] = useTransition();
  async function createBlog({ createDraft }: { createDraft: boolean }) {
    // TODO: add a support to make sure title is given
    setTransition(async () => {
      try {
        const response = await axios.post(
          `${BACKED_URL_LOCAL}api/v1/blog`,
          { content: blog, published: createDraft },
          {
            headers:{
              Authorization:localStorage.getItem('token')
            }
          }
        );
        toast.success(response.data.message);
        setBlog(initialValue);
      } catch (error: any) {
        return handleError(error);
      }
    });
    //TODO: Navigate to /my-daft page or /blogs /published
  }
  return {
    createBlog,
    isloading,
    blog,
    setBlog,
  };
};
export const useUpdateBlog = ({ postId }: { postId: string }) => {
  const [blog, setBlog] = useState<CustomElementType[]>(initialValue);
  const [isUpdating, setUpdateTransition] = useTransition();
  const [isloading, setFetchTransition] = useTransition();
  const [details, setDetails] = useState({
    id: "",
    publishedDate: "2025-06-21T15:08:03.091+00:00",
    authorOrNot: false,
    published: true,
    author: {
      name: "Dev",
    },
  });
  useEffect(() => {
    async function fetchData() {
      //check the blog is empty
      setFetchTransition(async () => {
        try {
          const response = await axios.get(
            `${BACKED_URL_LOCAL}api/v1/blog/${postId}`,
            {
              headers:{
                Authorization:localStorage.getItem('token')
              }
            }
          );
          const data = response.data.post.blogJson;
          setBlog(data);

          setDetails({
            id: response.data.post.id,
            publishedDate: response.data.post.id,
            author: response.data.post.author,
            authorOrNot: checkAuthor(response.data.post.authorId),
            published: response.data.post.published,
          });
        } catch (error: any) {
          return handleError(error);
        }
      });
    }
    fetchData();
  }, [postId]);
  async function updateBlog({ published }: { published: boolean }) {
    setUpdateTransition(async () => {
      try {
        const response = await axios.put(
          `${BACKED_URL_LOCAL}api/v1/blog`,
          { content: blog, postId, published },
          {
            headers:{
              Authorization:localStorage.getItem('token')
            }
          }
        );
        toast.success(response.data.message);
        setBlog(initialValue);
      } catch (error: any) {
        return handleError(error);
      }
    });
  }
  return {
    updateBlog,
    isUpdating,
    isloading,
    blog,
    setBlog,
    details,
  };
};

export interface User {
  userId: string;
  name: string;
  email: string;
}

// 2. Define the full context shape
export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
export const UserInfoContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}, // dummy function for default value
});
