import { Button } from "./Button";
import type { EditorType } from "./Editor/types";
import { wrapLink } from "./Editor/utils";
import { LinkInput } from "./LinkInput";

interface LinkProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  editor: EditorType;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  setMode: React.Dispatch<React.SetStateAction<"link" | "none">>;
  error: string;
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

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-all">
      <div className="flex flex-col gap-4">
        <LinkInput
          handleCancel={handleLinkCancel}
          handleSubmit={handleLinkSubmit}
          setUrl={props.setUrl}
          error={props.error}
          url={props.url}
        />

        <div className="flex gap-3 justify-end">
          <Button onClick={handleLinkSubmit}>Add Link</Button>
          <Button onClick={handleLinkCancel} color="cancel">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
