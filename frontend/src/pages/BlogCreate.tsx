
import { RichEditor } from "../components/Editor/RichEditor";
import { useCreateBlog } from "../hooks";

export const BlogCreate = () => {
  const { isloading, blog, setBlog, createBlog } = useCreateBlog();
  return (
    <div className="w-screen h-screen relative rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-6 pt-3 shadow-sm transition-all">
      <div className="min-h-full w-full rounded-sm pt-1 shadow-sm border-slate-300 h-full">
        <RichEditor
          setBlog={setBlog}
          isloading={isloading}
          handleClick={createBlog}
          blog={blog}
        />
      </div>
    </div>
  );
};
