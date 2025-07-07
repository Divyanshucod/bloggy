
import { useSelector } from "react-redux";
import { RichEditor } from "../components/Editor/RichEditor";
import type { RootState } from "../store";

export const BlogCreate = () => {
  const { isloading, BlogToCreate } = useSelector((state:RootState)=> state.BlogSlice)
  return (
    <>
    {isloading === 'pending' ? <div className="w-screen h-screen animate-pulse bg-white dark:bg-gray-900"></div> : <div className="w-screen h-screen relative rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-6 shadow-sm transition-all pt-14">
      <div className="min-h-full w-full rounded-sm pt-1 shadow-sm border-slate-300 h-full">
        <RichEditor
          blog={BlogToCreate}
          isCreatingBlog={true}
        />
      </div>
    </div>}
    </>
  );
};
