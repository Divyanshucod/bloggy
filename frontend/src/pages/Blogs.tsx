import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";
import { BlogsSkeleton } from "../components/BlogsSkeleton";

export const Blogs = () => {
  const { isloading, blogs } = useBlogs();
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
            />
          ))}
        </div>
      )}
    </div>
  );
};
