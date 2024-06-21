const shortenNumber = (num) => {
  if (num < 1000) {
    return num.toString();
  }

  const suffixes = ["", "K", "M", "B", "T"];
  const i = Math.floor(Math.log10(num) / 3);
  const shortNum = (num / Math.pow(1000, i)).toFixed(1);

  // Ensure the result is at most 3 characters long
  if (shortNum.length > 3) {
    return `${Math.round(num / Math.pow(1000, i))}${suffixes[i]}`;
  }

  return `${shortNum}${suffixes[i]}`;
};

export default shortenNumber;
