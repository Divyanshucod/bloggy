import { formattedDate } from "../helperFunctions";

interface FullBlogProps {
  title: string;
  content: string;
  publishedDate: string;
  id: string;
}
export const FullBlog = (props: FullBlogProps) => {
  return (
    <div>
      <div>
        <div className="text-slate-900 text-4xl font-bold">{props.title}</div>
        <p className="text-gray-500 mt-1">
          {formattedDate(props.publishedDate)}
        </p>
      </div>
      <div className="text-slate-600 font-thin mt-2">{props.content}</div>
    </div>
  );
};
