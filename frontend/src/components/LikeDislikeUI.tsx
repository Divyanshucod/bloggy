import React from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { updateComment } from "../features/comment/CommentSlice";
import { useAppDispatch } from "../hooks";
import { toast, ToastContainer } from "react-toastify";

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
  const [likeDislike, setLikeDislike] = React.useState(userReaction.likeDislike);
  const [likeCnt, setLikeCnt] = React.useState(likeDislikeCnt.like);
  const [dislikeCnt, setDislikeCnt] = React.useState(likeDislikeCnt.dislike);
  const dispatch = useAppDispatch();

  function handleUpdate(nextReaction: "LIKE" | "DISLIKE" | "NONE") {
    const val = setTimeout(async () => {
      try {
        await dispatch(updateComment({ commentId, likeDislike: nextReaction })).unwrap();
      } catch (error: any) {
        toast.error(error);
      }
    }, 800);

    return () => clearTimeout(val);
  }

  const handleReaction = (type: "LIKE" | "DISLIKE") => {
    let nextReaction: "LIKE" | "DISLIKE" | "NONE" = "NONE";

    if (likeDislike === type) {
      nextReaction = "NONE";
      if(type === "LIKE"){ setLikeCnt((prev) => prev - 1) } else { setDislikeCnt((prev) => prev - 1)};
    } else {
      // Switching or activating new reaction
      if (likeDislike === "LIKE") setLikeCnt((prev) => prev - 1);
      if (likeDislike === "DISLIKE") setDislikeCnt((prev) => prev - 1);

      if(type === "LIKE"){ setLikeCnt((prev) => prev + 1) } else { setDislikeCnt((prev) => prev + 1)};

      nextReaction = type;
    }

    setLikeDislike(nextReaction);
    handleUpdate(nextReaction);
  };

  return (
    <div className="flex items-center gap-6 mt-2 text-sm text-gray-600 dark:text-gray-300">
      {/* Like Button */}
      <div
        className={`flex items-center gap-1 cursor-pointer transition-all hover:text-blue-600 ${
          likeDislike === "LIKE" ? "text-blue-600" : ""
        }`}
        onClick={() => handleReaction("LIKE")}
      >
        <ThumbsUp
          className={`w-5 h-5 transition-all ${
            likeDislike === "LIKE" ? "text-blue-500 fill-blue-500" : "text-gray-500"
          }`}
        />
        <span>{likeCnt}</span>
      </div>

      {/* Dislike Button */}
      <div
        className={`flex items-center gap-1 cursor-pointer transition-all hover:text-red-600 ${
          likeDislike === "DISLIKE" ? "text-red-600" : ""
        }`}
        onClick={() => handleReaction("DISLIKE")}
      >
        <ThumbsDown
          className={`w-5 h-5 transition-all ${
            likeDislike === "DISLIKE" ? "text-red-500 fill-red-500" : "text-gray-500"
          }`}
        />
        <span>{dislikeCnt}</span>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LikeDislikeUI;
