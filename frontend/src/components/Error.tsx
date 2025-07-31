export const Error = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center min-h-[60vh] text-center px-4 dark:bg-slate-700">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Something went wrong!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mb-6">
        We're having trouble connecting to the server. Please try again later or
        check your network connection.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-slate-900 hover:bg-zinc-900 text-white px-6 py-2 rounded-md shadow-sm transition-all"
      >
        Reload Page
      </button>
    </div>
  );
};
