import { useNavigate } from "react-router-dom";


export const NoBlogs = () => {
    const navigate = useNavigate()
  return (
    <div className="text-center text-xl font-medium text-gray-600 dark:text-gray-300">
      <p>
         No blogs found.
      </p>
      <button
        onClick={() => navigate('/blogs') }
        className="bg-slate-800 hover:bg-zinc-900 text-white px-6 py-2 rounded-md shadow-sm transition-all mt-3"
      >
        Go to All Blogs
      </button>
    </div>
  );
};
