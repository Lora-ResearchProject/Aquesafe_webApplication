export const parseDateTime = (isoString) => {
    try {
      const date = new Date(isoString);
  
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
  
      // Format the date as YYYY-MM-DD
      const formattedDate = date.toISOString().split("T")[0];
  
      // Format the time as HH:MM
      const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5);
  
      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      console.error("Error parsing date-time:", error.message);
      return { date: "", time: "" };
    }
  };
  