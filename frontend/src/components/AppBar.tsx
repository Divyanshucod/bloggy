// import { Button } from "./Button"

import { Link } from "react-router-dom";

export const AppBar = () => {
  return (
    <div className="z-50 border-b-slate-200 border-b-1 px-10 py-2 flex justify-between fixed w-screen top-0 left-0 items-center bg-white">
      <div>Medium</div>
      <div className="flex gap-2 items-center">
        <Link to={"/create"}>
          <button
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            New Blog
          </button>
        </Link>
        <div className="rounded-full bg-gray-500 text-white px-5 py-2 flex items-center">
          {"h"}
        </div>
      </div>
    </div>
  );
};
