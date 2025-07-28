import React from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { updateComment } from "../features/comment/CommentSlice";
import { useAppDispatch } from "../hooks";

interface LikeDislikeUIProps {
  userReaction: {
    likeDislike: string;
    reaction: string;
  };
  likeDislikeCnt: {
    like: number;
    dislike: number;
  };
  commentId: string;
}

const LikeDislikeUI: React.FC<LikeDislikeUIProps> = ({
  userReaction,
  likeDislikeCnt,
  commentId,
}) => {
  const [likeDislike, setLikeDislike] = React.useState(
    userReaction.likeDislike
  );
  const [likeCnt, setLikeCnt] = React.useState(likeDislikeCnt.like);
  const [disLikeCnt, setDisLikeCnt] = React.useState(likeDislikeCnt.like);
  const dispatch = useAppDispatch();

  function handleUpdate() {
    let val;
    clearTimeout(val);
    val = setTimeout(() => {
      dispatch(updateComment({ commentId, likeDislike }));
    }, 1000);
  }
  return (
    <div className="flex items-center gap-6 mt-2 text-sm text-gray-600 dark:text-gray-300">
      {/* Like Button */}
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
        onClick={() => {
          setLikeDislike((prev) => (prev === "LIKE" ? "NONE" : "LIKE"));
          if (likeDislike === "LIKE") {
            setLikeCnt((prev) => prev - 1);
          } else {
            setLikeCnt((prev) => prev + 1);
          }
          handleUpdate();
        }}
      >
        <ThumbsUp
          name="thumb"
          className="w-5 h-5"
          style={{
            color: likeDislike === "LIKE" ? "blue" : "gray",
          }}
        />
        <span>{likeCnt}</span>
      </div>

      {/* Dislike Button */}
      <div
        className="flex items-center gap-1 cursor-pointer hover:text-red-600"
        onClick={() => {
          setLikeDislike((prev) => (prev === "DISLIKE" ? "NONE" : "DISLIKE"));
          if (likeDislike === "DISLIKE") {
            setDisLikeCnt((prev) => prev - 1);
          } else {
            setDisLikeCnt((prev) => prev + 1);
          }
          handleUpdate();
        }}
      >
        <ThumbsDown
          name="thumbDown"
          className="w-5 h-5"
          style={{
            color: likeDislike === "DISLIKE" ? "red" : "gray",
          }}
        />
        <span>{disLikeCnt}</span>
      </div>
    </div>
  );
};

export default LikeDislikeUI;
