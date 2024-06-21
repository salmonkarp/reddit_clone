function timeAgo(unixTimestamp) {
  if (!unixTimestamp) return "";
  const now = new Date();
  const elapsedSeconds = Math.floor(now.getTime() / 1000) - unixTimestamp;

  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInMonth = 30 * secondsInDay;
  const secondsInYear = 365 * secondsInDay;

  let timeString = "";

  if (elapsedSeconds < secondsInMinute) {
    timeString = `${elapsedSeconds} seconds ago`;
  } else if (elapsedSeconds < secondsInHour) {
    const minutes = Math.floor(elapsedSeconds / secondsInMinute);
    timeString = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (elapsedSeconds < secondsInDay) {
    const hours = Math.floor(elapsedSeconds / secondsInHour);
    timeString = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (elapsedSeconds < secondsInMonth) {
    const days = Math.floor(elapsedSeconds / secondsInDay);
    timeString = `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (elapsedSeconds < secondsInYear) {
    const months = Math.floor(elapsedSeconds / secondsInMonth);
    timeString = `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(elapsedSeconds / secondsInYear);
    timeString = `${years} year${years > 1 ? "s" : ""} ago`;
  }
  return timeString;
}

export default timeAgo;
