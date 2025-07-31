import { Avatar } from "@mui/material";

export const AuthorCard = ({
  authorName,
  setProfileOpen,
}: {
  authorName: string;
  setProfileOpen: (prev: boolean) => void;
}) => {
  return (
    <div className="w-full p-4 border rounded-xl shadow-md bg-white dark:bg-gray-800 transition-colors">
      <div className="text-xs uppercase tracking-wide font-semibold text-gray-400 dark:text-gray-500 mb-2">
        Written by
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Avatar />
        <div>
          <div className="text-md font-semibold text-gray-900 dark:text-white">
            {authorName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Author & Contributor
          </div>
        </div>
      </div>

      <button
        onClick={() => setProfileOpen(true)}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
      >
        View Profile
      </button>
    </div>
  );
};
