import type {CustomElementType } from "@dev0000007/medium-web";
import type { Descendant } from "slate";

export function formattedDate(date:string){
    const dateFormate = new Date(date);
    
    const formatted = dateFormate.toLocaleString('en-US', {
      month: 'short',   // "Dec"
      day: 'numeric',   // "3"
      year: 'numeric',  // "2023"
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return formatted;
    }

export const getCustomFormattedDate = (date = new Date()) => {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
}

export const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

// type DataType = {type:string,children:Descendant[]}