import { useRef, useState } from "react";
import { Button } from "./Button";
import { LabelledInput } from "./LabelledInput";
import type { EditorType } from "./Editor/types";
import { insertImage } from "./Editor/utils";
import { Upload } from "lucide-react";

export const ImageModal = ({ setIsImage, editor }: { setIsImage: (val: boolean) => void; editor: EditorType }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  // Image URL regex
  const imageUrlRegex = /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp)(\?.*)?$/i;

  const handleImageInUrl = () => {
    if (!url.trim()) {
      setError("Please enter an image URL.");
      return;
    }

    if (!imageUrlRegex.test(url)) {
      setError("Invalid image URL. Make sure it ends with a valid image extension.");
      return;
    }

    insertImage(editor, url);
    setIsImage(false);
  };

  const handleImage = () => {
    imageRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const url = window.URL.createObjectURL(file);
    insertImage(editor, url);
    setIsImage(false);
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2  z-50 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 space-y-6 transition-all">
      
      {/* URL Input */}
      <div className="space-y-2">
        <LabelledInput
          label="Image URL"
          placeholder="https://example.com/image.jpg"
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(""); // clear error on typing
          }}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button onClick={handleImageInUrl}>
          Insert from URL
        </Button>
      </div>

      {/* OR Separator */}
      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
        <div className="flex-1 border-t border-gray-300 dark:border-gray-600" />
        <span>OR</span>
        <div className="flex-1 border-t border-gray-300 dark:border-gray-600" />
      </div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <Button color="secondary" onClick={handleImage}>
          Upload Image
        </Button>
        <input hidden ref={imageRef} type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* Cancel */}
      <div className="flex justify-end pt-2">
        <Button color="outline" onClick={() => setIsImage(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
