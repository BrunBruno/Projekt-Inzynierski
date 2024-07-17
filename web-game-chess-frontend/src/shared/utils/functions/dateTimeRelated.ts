// format time for colck display
// get total time in minutes and converts to dd:hh:mm:ss
export const makeTimeFromMinutes = (minutes: number): string => {
  const totalSeconds = minutes * 60;
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.round(totalSeconds % 60);

  const formattedDays = days > 0 ? `${days}d:` : "";
  const formattedHours =
    hours === 0 && days === 0 ? "" : `${String(hours).padStart(2, "0")}:`;
  const formattedMinutes = `${String(mins).padStart(2, "0")}:`;
  const formattedSeconds = `${String(secs).padStart(2, "0")}`;

  return `${formattedDays}${formattedHours}${formattedMinutes}${formattedSeconds}`.trim();
};

// format date for charts
// gets date and return in form dd.mm.yy
export const formatDate = (date: Date): string => {
  const add0 = (value: string): string => {
    return value.length === 1 ? "0" + value : value;
  };

  return (
    add0(date.getDate().toString()) +
    "." +
    add0((date.getMonth() + 1).toString()) +
    "." +
    date.getFullYear()
  );
};
