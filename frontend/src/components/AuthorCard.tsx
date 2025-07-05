export const AuthorCard = ({
  authorName,
  bioData,
}: {
  authorName: string;
  bioData: string;
}) => {
  return (
    <div className="w-full">
      <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
        Author
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold text-lg">
          {authorName[0]}
        </div>
        <div className="text-gray-900 dark:text-white font-semibold text-xl">
          {authorName}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {bioData.slice(0, 100)}
        {bioData.length > 100 && "..."}
      </p>
    </div>
  );
};
