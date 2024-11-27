/* time and date global functions */

// format time for clock display
// get total time in minutes and converts to dd:hh:mm:ss
export const makeTimeFromMinutes = (minutes: number): string => {
  const totalSeconds = minutes * 60;
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const formattedDays = days > 0 ? `${days}d:` : "";
  const formattedHours = hours === 0 && days === 0 ? "" : `${String(hours).padStart(2, "0")}:`;
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

  return add0(date.getDate().toString()) + "." + add0((date.getMonth() + 1).toString()) + "." + date.getFullYear();
};

// checks if duration exceeds some period
export const timeSpanLongerThan = (startDate: Date, endDate: Date, seconds: number): boolean => {
  const timeSpan = (endDate.valueOf() - startDate.valueOf()) / 1000;

  if (timeSpan >= seconds) {
    return true;
  }

  return false;
};

// to get time days of user membership
export const getTimePlayed = (joinDate: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - joinDate.getTime();

  const days = Math.floor(diffInMs / 1000 / 60 / 60 / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  if (years > 0) {
    return `${years}Y`;
  } else if (months > 0) {
    return `${months}M`;
  } else if (days > 0) {
    return `${days}D`;
  } else {
    return "1D";
  }
};

export const getSimpleDuration = (duration: string | null): string => {
  if (!duration) return "";

  const [hours, minutes, seconds] = duration.split(":").map(parseFloat);

  if (hours !== 0) return `${hours.toFixed(1)}h`;
  if (minutes !== 0) return `${minutes.toFixed(1)}m`;
  return `${seconds.toFixed(1)}s`;
};
