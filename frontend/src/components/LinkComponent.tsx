import type { EditorType } from "./Editor/types";
import { wrapLink } from "./Editor/utils";

interface LinkProps {
    setError:React.Dispatch<React.SetStateAction<string>>,
    url:string,
    editor:EditorType,
    setUrl:React.Dispatch<React.SetStateAction<string>>,
    setMode:React.Dispatch<React.SetStateAction<"link" | "none">>
    error:string
}
export const LinkComp = ({ props }: { props: LinkProps }) => {
  const handleLinkSubmit = () => {
    if (!props.url.trim()) {
      props.setError("Please enter a URL");
      return;
    }

    const success = wrapLink(props.editor, props.url.trim());
    if (!success) {
      props.setError(
        "Invalid URL or no text selected. Please select text first or enter a valid URL."
      );
    } else {
      props.setUrl("");
      props.setMode("none");
      props.setError("");
    }
  };

  const handleLinkCancel = () => {
    props.setUrl("");
    props.setMode("none");
    props.setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLinkSubmit();
    } else if (e.key === "Escape") {
      handleLinkCancel();
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-all">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Enter URL
          </label>
          <input
            value={props.url}
            onChange={(e) => props.setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            autoFocus
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {props.error && (
          <div className="text-sm text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 p-2 rounded border border-red-300 dark:border-red-600">
            {props.error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleLinkSubmit}
            className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Add Link
          </button>
          <button
            onClick={handleLinkCancel}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
