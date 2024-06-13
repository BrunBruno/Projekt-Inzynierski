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