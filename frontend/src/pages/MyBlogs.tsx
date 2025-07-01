import { BlogCard } from "../components/BlogCard";
import { useMyBlogs, UserInfoContext } from "../hooks";
import { BlogsSkeleton } from "../components/BlogsSkeleton";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const MyBlogs = () => {
  const { isloading, blogs } = useMyBlogs();
  const {user} = useContext(UserInfoContext)
  const navigate = useNavigate()
  if(!user){
    toast.error('Session Expired!')
    setTimeout(()=>navigate('/signup'),1000)
  }
  return (
    <div>
      {isloading ? (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogsSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="mt-12">
          {blogs.map((val) => (
            <BlogCard
              key={val.id}
              id={val.id}
              authorName={val.author.name}
              publishedDate={val.publishedDate}
              title={val.title}
              content={val.content}
              isMyBlogs={true}
              published={val.published}
            />
          ))}
        </div>
      )}
    </div>
  );
};
