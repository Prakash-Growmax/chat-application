import { ApiError } from "@/services/apiConfig";
import { chatService } from "@/services/ChatService";
import { getAccessToken } from "@/utils/storage.utils";
import { useEffect } from "react";
import { useProfile } from "./profile/useProfile";

export function useChatList(setSessionList) {
  const { profile } = useProfile();
  async function getSessionList() {
    if (profile?.organization_id) {
      try {
        const token = getAccessToken();
        const response = await chatService.getSession({
          headers: {
            "Content-Type": "application/json",
            "x-organization-id": profile.organization_id,
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.status !== 200)
          throw new Error("Error while creating session");

        setSessionList(response);
        return response;
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

  useEffect(() => {
    if (profile?.organization_id) {
      getSessionList();
    }
  }, [profile?.organization_id]);
  return {
    //  getSessionList,
    //  sessionList
  };
}
