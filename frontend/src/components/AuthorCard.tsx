export const AuthorCard = ({
  authorName,
  bioData,
}: {
  authorName: string;
  bioData: string;
}) => {
  return (
    <div className="w-full">
      <div className="text-slate-500 mb-2">Author</div>
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-gray-500 text-white px-4 py-2">
          {authorName[0]}
        </div>
        <div className="text-slate-900 font-bold text-2xl">{authorName}</div>
      </div>
      <div className="text-slate-700 font-thin mt-1">
        {`${bioData.slice(0, 100)}${bioData.length > 20 && "..."} `}
      </div>
    </div>
  );
};
