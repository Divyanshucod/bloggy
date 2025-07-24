
import type { CustomElementType } from "@dev0000007/medium-web";
import axios from "axios";
import { toast } from "react-toastify";
import { Node } from "slate";
import { BACKED_URL_LOCAL } from "./config";

export function formattedDate(date: string) {
  const dateFormate = new Date(date);

  const formatted = dateFormate.toLocaleString("en-US", {
    month: "short", // "Dec"
    day: "numeric", // "3"
    year: "numeric", // "2023"
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formatted;
}
export const initialValue = {
  title:'',
  content: [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ],
  tags:[]
}
export const initialValueFullBlog = {
  title: '',
  content: [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ],
  tags: [],
  commentsCnt: 0,
  reactions: {
    like: 0,
    dislike: 0,
    reaction: 0
  }
};


export const handleError = (error: any) => {
  if (error.response && error.response.data && error.response.data.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error("Server is unreachable or something went wrong.");
  }
}

export const checkBlog = (nodes:CustomElementType)=>{
  return nodes.map(n => Node.string(n)).join('\n')
}

export const getS3Url = async (file: File) => {

  try {
    const response = await axios.get(
      `${BACKED_URL_LOCAL}api/v1/presigned?type=${file.type}`,
      { withCredentials: true }
    );
    await axios.put(response.data.url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    return response.data.publicUrl;
  } catch (error) {
    console.log(error);
    handleError(error);
    return "";
  }
};

export const deleteImage = async (urls:string[])=>{
  try {
     const response = await axios.post(`${BACKED_URL_LOCAL}api/v1/removeImages`,urls, {withCredentials:true})
     toast.success(response.data.message)
  } catch (error) {
     handleError(error)
     return "";
  }
}