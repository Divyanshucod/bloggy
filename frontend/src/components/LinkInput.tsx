interface LinkInputs {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  handleSubmit: () => void;
  handleCancel?: () => void;
}
export const LinkInput = (props: LinkInputs) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      props.handleSubmit();
    } else if (e.key === "Escape" && props.handleCancel) {
      props.handleCancel();
    }
  };
  return (
    <div>
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

      {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
    </div>
  );
};
