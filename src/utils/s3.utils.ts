export const cleanKey = (inputKey: string): string => {
  // Remove s3:// prefix and bucket name if present
  let cleaned = inputKey.replace(/^s3:\/\/[^/]+\//, "");

  // Remove any leading/trailing slashes
  cleaned = cleaned.replace(/^\/+|\/+$/g, "");

  cleaned = cleaned.replace(/^analytics\/analytics\//, "analytics/");

  if (!cleaned.startsWith("analytics/")) {
    cleaned = `analytics/${cleaned}`;
  }

  return cleaned;
};
export const cleanFilename = (inputKey: string): string => {
  // Remove s3:// prefix and bucket name if present
  let cleaned = inputKey.replace(/^s3:\/\/[^/]+\//, "");

  // Remove any leading/trailing slashes
  cleaned = cleaned.replace(/^\/+|\/+$/g, "");

  // Remove "analytics/" prefix if present
  cleaned = cleaned.replace(/^analytics\//, "");

  return cleaned;
};