import { Tooltip } from "@mui/material";
import { Edit } from "lucide-react";

import { Avatar } from "./Avatar";
import type { commentType } from "../features/comment/CommentSlice";
import { howLongAgo } from "../helperFunctions";
// import { Reactions } from "./Reactions";

export const CommentCard = (props:commentType) => {
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
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{props.commentor}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{howLongAgo(props.createdAt)}</div>
        </div>
      </div>

      {/* Comment Text */}
      <div className="text-gray-700 dark:text-gray-300 text-sm mb-4">
        {props.comment}
      </div>
     
    </div>
  );
};
