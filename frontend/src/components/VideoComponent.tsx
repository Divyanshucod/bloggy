import { useState } from "react";
import { Button } from "./Button";
import type { EditorType } from "./Editor/types";
import { insertImageOrVideo } from "./Editor/utils";
import { LinkInput } from "./LinkInput";

interface videoProps {
    editor:EditorType,
    setIsVideo: (val:boolean)=>void
}
export const VideoComponent = (props: videoProps) => {
    const [error,setError] = useState('')
    const [url,setUrl] = useState('')
  const handleLinkSubmit = () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    const success = insertImageOrVideo(props.editor, url.trim(),'video');
    if (!success) {
      setError(
        "Invalid URL.Please enter a valid URL."
      );
    } else {
      setUrl("");
      setError("");
      props.setIsVideo(false)
    }
  };

  const handleLinkCancel = () => {
    setUrl("");
    setError("");
    props.setIsVideo(false)
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-all">
      <div className="flex flex-col gap-4">
        <LinkInput handleCancel={handleLinkCancel} handleSubmit={handleLinkSubmit} setUrl={setUrl} error={error} url={url} />

        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleLinkSubmit}
          >
            Add Link
          </Button>
          <Button
            onClick={handleLinkCancel}
            color="cancel"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
