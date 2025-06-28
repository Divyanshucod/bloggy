
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
  