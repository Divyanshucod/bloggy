import {  useParams } from "react-router-dom";
import {  useUpdateBlog } from "../hooks";
import { FullBlog } from "../components/FullBlog";
import { AuthorCard } from "../components/AuthorCard";
import { Skeleton, Stack}  from "@mui/material";
import { ToastContainer } from "react-toastify";

const Blog = () => {
  const { id } = useParams();
  const { isloading, blog, setBlog, updateBlog, isUpdating, details } =
    useUpdateBlog({
      postId: id || "",
    });
  return (
    <div className="grid grid-cols-12 w-screen p-5 md:p-10">
      <ToastContainer />
      <div className="col-span-12 lg:col-span-8">
        {isloading ? (
          <Stack>
            <Skeleton variant="text" sx={{ fontSize: "3rem" }} />
            <Skeleton variant="rounded" width={600} height={500} />
          </Stack>
        ) : (
          <FullBlog
            blog={blog}
            setBlog={setBlog}
            isloading={isUpdating}
            updateFunction={updateBlog}
            authorOrNot={details.authorOrNot}
            published={details.published}
          />
        )}
      </div>
      <div className="hidden lg:block rounded-sm shadow-sm border border-gray-300 p-3 w-full col-span-4 ml-2 h-44">
        {isloading ? (
          <Stack>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="rounded" width={210} height={60} />
          </Stack>
        ) : (
          <AuthorCard
            authorName={details.author.name}
            bioData="I love playing games and l love coding and solving real world problems. i am a fullstack developer too."
          />
        )}
      </div>
    </div>
  );
};

export default Blog;
