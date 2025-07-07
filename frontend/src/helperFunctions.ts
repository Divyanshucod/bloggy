
import { toast } from "react-toastify";

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
export const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default function handleError(error: any) {
  if (error.response && error.response.data && error.response.data.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error("Server is unreachable or something went wrong.");
  }
}
