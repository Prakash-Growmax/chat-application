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
