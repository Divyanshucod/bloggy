import { Tooltip } from "@mui/material";
import { Edit } from "lucide-react";

import { Avatar } from "./Avatar";
import {
  updateComment,
  type commentType,
} from "../features/comment/CommentSlice";
import { howLongAgo } from "../helperFunctions";
import LikeDislikeUI from "./LikeDislikeUI";
import { useState } from "react";
import { Button } from "./Button";
import { useAppDispatch } from "../hooks";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { toast } from "react-toastify";

export const CommentCard = (props: commentType) => {
  const { user } = useSelector((state: RootState) => state.UserSlice);
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState(props.comment);
  const [isEditng, setIsEditing] = useState(false);
  async function handleCommentUpdate() {
    if (comment.trim() === "") {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      const res = await dispatch(
        updateComment({
          commentId: props.id,
          comment: comment,
          likeDislike: "NONE",
        })
      ).unwrap();
      toast.success(res);
    } catch (error: any) {
      toast.error(error);
    }
    setIsEditing(false);
  }
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-5 relative dark:border-gray-700">
      {/* Edit Button */}
      <button className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
        {user?.id === props.commentorId && !isEditng && (
          <Tooltip title="Edit" placement="top-start">
            <Edit
              size={18}
              className="text-gray-700 dark:text-white"
              onClick={() => setIsEditing(true)}
            />
          </Tooltip>
        )}
      </button>

      {/* Header: Avatar, Name, Time */}
      <div className="flex items-center space-x-3 mb-3">
        <Avatar user="Dev" />
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {props.commentor.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {howLongAgo(props.commentedAt)}
          </div>
        </div>
      </div>
      <div className="mb-4">
        {isEditng ? (
          <div className="flex flex-col gap-2">
            <textarea
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Edit your comment..."
            />
            <div className="flex justify-end gap-2">
              <Button color="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleCommentUpdate}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start text-sm text-gray-700 dark:text-gray-300">
            <p className="whitespace-pre-line">{props.comment}</p>
          </div>
        )}
      </div>

      <div>
        <LikeDislikeUI
          userReaction={props.currentUserReactions}
          likeDislikeCnt={props.reactionsCnt}
          commentId={props.id}
        />
      </div>
    </div>
  );
};
