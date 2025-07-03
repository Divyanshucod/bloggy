import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { BlogsSkeleton } from "../components/BlogsSkeleton";
import { ToastContainer } from "react-toastify";

export const Blogs = () => {
  const { isloading, blogs,setPages,isMoreBlog } = useBlogs();
  console.log(blogs);

  return (
    <div>
      <ToastContainer />
      {isloading ? (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <BlogsSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="mt-12"> 
        <div>
          {blogs.map((val) => (
            <BlogCard
              key={val.id}
              id={val.id}
              authorName={val.author.name}
              publishedDate={val.publishedDate}
              title={val.title}
              content={val.content}
              published={val.published}
            />
          ))}
        </div>
          {isMoreBlog ? <button className="flex justify-center" onClick={()=>  setPages((prev) => prev+1)}>More</button> :null}
       </div>
      )}
    </div>
  );
};
