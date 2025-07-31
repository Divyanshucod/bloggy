import { Avatar } from "./Avatar";

export const MenuBar = () => {
  return (
    <>
      <Avatar user={"Dev"} />
      {/* Dropdown on Hover */}
      <div className="absolute top-full mt-2 right-0 hidden group-hover:block z-50 w-40 bg-white dark:bg-gray-800 text-sm rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200">
        <div className="py-1 text-gray-700 dark:text-gray-200">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            My Blogs
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            Settings
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};
