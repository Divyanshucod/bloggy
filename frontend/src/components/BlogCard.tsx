import { Link } from "react-router-dom";
import { formattedDate } from "../helperFunctions";
import React from "react";
import { Avatar } from "./Avatar";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
  id: string;
  published: boolean;
  isMyBlogs?: boolean;
}

export const BlogCard = React.memo((props: BlogCardProps) => {
  return (
      <div className="min-w-full px-4 py-3 flex mx-auto flex-col">
          <Link to={`/blog/${props.id}`} className="w-full flex justify-center">
        <div className="w-full max-w-3xl p-6 rounded-lg shadow bg-white dark:bg-gray-900 transition">
          <div className="flex flex-col gap-2 min-h-44">
            <div className="flex gap-3 items-center mb-2 text-sm">
             <Avatar user={props.authorName[0]}/>
              <p className="text-slate-700 dark:text-slate-200 font-semibold">
                {props.authorName}
              </p>
              <span className="text-xl text-gray-400">•</span>
              <span className="text-slate-500 dark:text-slate-400">
                {formattedDate(props.publishedDate)}
              </span>
              {props.isMyBlogs && (
                <span
                  className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                    props.published
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {props.published ? "Published" : "Draft"}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {props.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base ">
              {props.content}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              {Math.max(1, Math.floor(props.content.length / 100))} min read
            </p>
          </div>
        </div>
        </Link>
      </div>
  );
});
