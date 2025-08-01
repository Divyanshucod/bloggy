import React, { useState, useRef, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Smile,
  Heart,
  Lightbulb,
  Annoyed,
  SmilePlus,
} from "lucide-react";
import {
  addBlogReaction,
  type extras,
  type likeDislikeType,
  type reactionType,
} from "../features/Blogs/BlogSlice";
import { toast } from "react-toastify";
import { useAppDispatch } from "../hooks";

const emojis = [
  { id: "SMILE", icon: Smile, color: "yellow" },
  { id: "HEART", icon: Heart, color: "pink" },
  { id: "IDEA", icon: Lightbulb, color: "amber" },
  { id: "ANNOYED", icon: Annoyed, color: "yellow" },
];
type ReactionType = "SMILE" | "HEART" | "IDEA" | "ANNOYED" | "NONE";
const EmojiReactionToggler = ({
  props,
  blogId,
}: {
  props: extras;
  blogId: string;
}) => {
  const [mainOpen, setMainOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [reactionCnt, setReactionCnt] = useState({
    like: 0,
    dislike: 0,
    reaction: 0,
  });
  const [react, setReact] = useState({
    likeDislike: "NONE",
    reaction: "NONE",
  } as extras["currentUserReactions"]);
  const dispatch = useAppDispatch();
  function handleCntUpdate(isActive: boolean, type: likeDislikeType) {
    if (isActive) {
      if (type === "LIKE") {
        setReactionCnt({
          ...reactionCnt,
          like: reactionCnt.like + 1,
        });
      } else {
        setReactionCnt({
          ...reactionCnt,
          dislike: reactionCnt.dislike + 1,
        });
      }
    } else {
      setReactionCnt({
        ...reactionCnt,
        like: reactionCnt.like - 1,
        dislike: reactionCnt.dislike - 1,
      });
    }
  }
  useEffect(() => {
    if (props.currentUserReactions) {
      setReact(props.currentUserReactions);
    }
    if (props.reactions) {
      setReactionCnt(props.reactions);
    }
  }, [props.currentUserReactions, props.reactions]);

  async function handleReactionUpdate({
    likeDislike,
    reaction,
  }: {
    likeDislike: likeDislikeType;
    reaction: reactionType;
  }) {
    let val;

    clearTimeout(val);
    val = setTimeout(async () => {
      try {
        await dispatch(
          addBlogReaction({ blogId, reactions: { likeDislike, reaction } })
        ).unwrap();
      } catch (error: any) {
        toast.error(error);
      }
    }, 1000);
  }
  const refs = {
    mainMenu: useRef<HTMLDivElement>(null),
    emojiMenu: useRef<HTMLDivElement>(null),
    toggler: useRef<HTMLButtonElement>(null),
  };
  

  const iconMap = {
    LIKE: <ThumbsUp className="w-4 h-4 text-blue-500" fill="currentColor" />,
    DISLIKE: (
      <ThumbsDown className="w-4 h-4 text-red-500" fill="currentColor" />
    ),
  };

  const getEmojiIcon = (id:ReactionType) => {
    const emoji = emojis.find((e) => e.id === id);
    if (!emoji) return null;
    return React.createElement(emoji.icon, {
      className: `w-5 h-5 stroke-${emoji.color}-500`,
    });
  };

  const getDisplayIcon = () => {
    const { likeDislike, reaction } = react;
    if (likeDislike !== "NONE" && reaction !== "NONE") {
      return (
        <div className="flex flex-col items-center justify-center space-y-0.5">
          {iconMap[likeDislike]}
          {getEmojiIcon(reaction)}
        </div>
      );
    }
    if (likeDislike !== "NONE") return iconMap[likeDislike];
    if (reaction !== "NONE") return getEmojiIcon(reaction);
    return <SmilePlus className="w-5 h-5 text-gray-400 dark:text-gray-500" />;
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
      !refs.mainMenu.current?.contains(e.target as Node) &&
      !refs.toggler.current?.contains(e.target as Node)
      ) {
      setMainOpen(false);
      }
      if (!refs.emojiMenu.current?.contains(e.target as Node)) {
      setEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <button
          ref={refs.toggler}
          onClick={() => {
            setMainOpen(!mainOpen);
            setEmojiOpen(false);
          }}
          className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center dark:border-gray-600 justify-center transform hover:scale-105 active:scale-95 cursor-pointer ${
            mainOpen ? "ring-2 ring-blue-300 dark:ring-blue-600" : ""
          }`}
        >
          {getDisplayIcon()}
        </button>

        {/* Main Menu */}
        <div
          ref={refs.mainMenu}
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:border transition-all duration-300 origin-bottom ${
            mainOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex flex-col p-2 space-y-1">
            {["LIKE", "DISLIKE"].map((type) => {
              const isActive = react.likeDislike === type;
              const color = type === "LIKE" ? "blue" : "red";
              const Icon = type === "LIKE" ? ThumbsUp : ThumbsDown;
              return (
                <div className="relative">
                  <button
                    key={type}
                    onClick={() => {
                      setReact({
                        ...react,
                        likeDislike: isActive ? "NONE" : type as likeDislikeType,
                      });
                      handleCntUpdate(isActive, type as likeDislikeType);
                      setMainOpen(false);
                      handleReactionUpdate({
                        likeDislike: isActive ? "NONE" : type as likeDislikeType,
                        reaction: react.reaction as reactionType,
                      });
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                      isActive
                        ? `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <Icon
                      className="w-5 h-5"
                      fill={isActive ? "currentColor" : "none"}
                    />
                  </button>
                  <span className="absolute top-0 right-0 text-gray-500 ">
                    {type === "LIKE" ? reactionCnt.like : reactionCnt.dislike}
                  </span>
                </div>
              );
            })}
            <div className="relative">
              <button
                onClick={() => {
                  setEmojiOpen(!emojiOpen);
                  setMainOpen(false);
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                  react.reaction !== "NONE"
                    ? "bg-yellow-100 dark:bg-yellow-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {react.reaction !== "NONE" ? (
                  getEmojiIcon(react.reaction)
                ) : (
                  <Smile className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
              </button>
              <span className="absolute top-0 right-0 text-gray-500">
                {reactionCnt.reaction}
              </span>
            </div>
          </div>
        </div>

        {/* Emoji Menu */}
        <div
          ref={refs.emojiMenu}
          className={`absolute top-0 right-full mr-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:border transition-all duration-300 origin-right ${
            emojiOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex p-2 space-x-1">
            {emojis.map(({ id, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => {
                  setReact({
                    ...react,
                    reaction:
                      react.reaction === id ? "NONE" : (id as reactionType),
                  });
                  setReactionCnt({
                    ...reactionCnt,
                    reaction:
                      react.reaction === id
                        ? reactionCnt.reaction - 1
                        : reactionCnt.reaction + 1,
                  });
                  setEmojiOpen(false);
                  handleReactionUpdate({
                    likeDislike: react.likeDislike as likeDislikeType,
                    reaction:
                      react.reaction === id ? "NONE" : (id as reactionType),
                  });
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
                  react.reaction === id
                    ? `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-500`
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    react.reaction === id
                      ? `stroke-${color}-500`
                      : "stroke-gray-500"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiReactionToggler;
