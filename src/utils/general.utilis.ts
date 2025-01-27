export const capitalizeFirstName = (name: string) => {
  if (!name) return ""; // Handle empty or null input
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const getInitials = (name: string) => {
  if (!name) return "?";
  const nameParts = name.trim().split(" ");
  return nameParts.length > 1
    ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
    : nameParts[0][0].toUpperCase();
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);

  // Get month, date
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  // Get hours, minutes, seconds in 12-hour format with padding
  const hours = date.getHours() % 12 || 12;
  const paddedHours = hours.toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${month} ${day}, ${paddedHours}:${minutes}:${seconds} ${ampm}`;
};
