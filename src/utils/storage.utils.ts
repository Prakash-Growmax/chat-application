import {
  AccessToken_LocalKey,
  ChatId_LocalKey,
} from "@/constants/storage.constant";

export const tokenType = "Bearer";

export function getAccessToken(): string | null {
  try {
    const storedToken = localStorage.getItem(AccessToken_LocalKey);
    if (storedToken) {
      const parsedToken = JSON.parse(storedToken);
      return parsedToken?.access_token || null;
    }
    return null;
  } catch (error) {
    console.error("Failed to get stored token:", error);
    return null;
  }
}

export function getChatId(): string {
  try {
    const chatId = localStorage.getItem(ChatId_LocalKey);
    if (chatId) {
      return chatId;
    }
    return "";
  } catch (error) {
    console.error("Failed to get chatId:", error);
    return "";
  }
}
