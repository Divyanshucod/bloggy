export function formattedDate(date: string) {
  const dateFormate = new Date(date);

  const formatted = dateFormate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return formatted;
}
