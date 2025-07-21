import { useRef, useState } from "react";
import { Button } from "./Button";
import type { EditorType } from "./Editor/types";
import { insertImageOrVideo } from "./Editor/utils";
import { getS3Url } from "../helperFunctions";
import { LinkInput } from "./LinkInput";

export const ImageModel = ({ setIsImage, editor }: { setIsImage: (val: boolean) => void; editor: EditorType }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleImageInUrl = () => {
    if (!url.trim()) {
      setError("Please enter an image URL.");
      return;
    }

    const success = insertImageOrVideo(editor, url,'image');
    console.log(success);
    
    if(!success){
      setError('enter a valid image url jpg,png,jpeg')
      return;
    }
    setIsImage(false);
  };

  const handleImage = () => {
    imageRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    //if check the size is greate then 5 MB (5*1000*1000)
    console.log(file);
    const fileSize = file.size / 1024 / 1024;
    if(fileSize > 5 )
    {
      setError("Image size can't be more then 5MB")
      return;
    }
    const url = await getS3Url(file)
    if(url.length == "")return;
    insertImageOrVideo(editor, url,'image');
    setIsImage(false);
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2  z-100 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 space-y-6 transition-all">
      
      {/* URL Input */}
      <LinkInput setUrl={setUrl} handleSubmit={handleImageInUrl} error={error} url={url}/>
      <div className="space-y-2">                    
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
        <Button color="cancel" onClick={() => setIsImage(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
