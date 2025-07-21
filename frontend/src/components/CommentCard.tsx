import { Tooltip } from "@mui/material";
import { Edit, Reply, ThumbsDown, ThumbsUp } from "lucide-react";
import { Emojis } from "./Emojis";
import { Avatar } from "./Avatar";

export const CommentCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-5 relative dark:border-gray-700">
      {/* Edit Button */}
      <button className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
        <Tooltip title="Edit" placement="top-start">
          <Edit size={18} className="text-gray-700 dark:text-white" />
        </Tooltip>
      </button>

      {/* Header: Avatar, Name, Time */}
      <div className="flex items-center space-x-3 mb-3">
       <Avatar user="Dev"/>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Dev</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">56 minutes ago</div>
        </div>
      </div>

      {/* Comment Text */}
      <div className="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam unde accusantium vero repudiandae in! Cumque veniam mollitia repellat accusamus.
      </div>

      {/* Actions */}
      <div className="flex gap-5 items-center text-gray-800 dark:text-gray-100">
        <Tooltip title="Like">
          <ThumbsUp size={20} className="cursor-pointer hover:text-green-600" />
        </Tooltip>
        <Tooltip title="Dislike">
          <ThumbsDown size={20} className="cursor-pointer hover:text-red-500" />
        </Tooltip>
        <Emojis />
        <Tooltip title="Reply">
          <Reply size={20} className="cursor-pointer hover:text-blue-500" />
        </Tooltip>
      </div>
    </div>
  );
};
