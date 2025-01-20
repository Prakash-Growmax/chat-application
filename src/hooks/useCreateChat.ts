import { ApiError } from "@/services/apiConfig";
import { chatService } from "@/services/ChatService";
import { getAccessToken } from "@/utils/storage.utils";
import { useProfile } from "./profile/useProfile";

const chatId = localStorage.getItem("chatId");

export function useCreateChatId() {
  const { profile } = useProfile();

  async function getChatId() {
    if (profile?.organization_id) {
      const requestBody = {
        name: "New Thread",
        chat_metadata: {
          message: "Trying the chat API...",
        },
      };

      try {
        const token = getAccessToken();
        const response = await chatService.createSession(requestBody, {
          headers: {
            "x-organization-id": profile.organization_id,
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.status !== 200)
          throw new Error("Error while creating session");

        const chat_id = response?.data?.id;
        localStorage.setItem("chatId", response?.data?.id);
        return chat_id;
      } catch (error) {
        if (error instanceof ApiError) {
          console.error(`API Error: ${error.status} - ${error.statusText}`);
        }
      }
    } else {
      console.error("Organization ID is missing.");
      throw new Error("Organization ID is required");
    }
  }

  return {
    getChatId,
    chatId,
  };
}
