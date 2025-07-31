export const BlogsSkeleton = () => {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-10 w-10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      </div>
      <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
    </div>
  );
};
