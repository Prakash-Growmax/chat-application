import { chatService } from "@/services/ChatService";
import { ApiError } from "@/services/apiConfig";
import { ChatMessage } from "@/types";
import { Profile } from "@/types/profile";
import { formQueueMessage } from "@/utils/chat.utils";
import { getAccessToken } from "@/utils/storage.utils";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabase";

export async function saveChatMessage(
  userId: string,
  message: ChatMessage,
  fileId: string
): Promise<void> {
  try {
    const { error } = await supabase.from("chats").insert({
      user_id: userId,
      content: message.content,
      role: message.role,
      token_usage: message.tokenUsage,
      csv_file_id: fileId,
      timestamp: message.timestamp.toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error("Failed to save chat message:", error);
    throw error;
  }
}

export async function getChatHistory(
  userId: string,
  fileId: string
): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .eq("csv_file_id", fileId)
      .order("timestamp", { ascending: true });

    if (error) throw error;

    return data.map((chat) => ({
      id: chat.id,
      content: chat.content,
      role: chat.role,
      tokenUsage: chat.token_usage,
      timestamp: new Date(chat.timestamp),
    }));
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    throw error;
  }
}

export async function createChatId(profile: Profile , setHistoryList) {

  try {
    if (profile?.organization_id) {
      const clientGeneratedId = uuidv4();
      const requestBody = {
        name: "New Thread",
        chat_metadata: {
          message: "Trying the chat API...",
        },
        session_id: clientGeneratedId,
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
        let chatId = clientGeneratedId;

        if (response?.data?.uuid_changed) {
          chatId = response?.data?.id;
        }
        localStorage.setItem("chatId", chatId);
        setHistoryList(true);
        return chatId;
      } catch (error) {
        if (error instanceof ApiError) {
          console.error(`API Error: ${error.status} - ${error.statusText}`);
        }
      }
    } else {
      console.error("Organization ID is missing.");
      throw new Error("Organization ID is required");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function uploadDocumentToChat(
  chatId: string,
  s3Key: string,
  profile: Profile,
  setS3Key:string
) {
  try {
    const token = getAccessToken();

    const result = await chatService.uploadDataset(
      {
        s3_path: `s3://growmax-dev-app-assets/analytics/${s3Key}`,
        org_id: profile.organization_id,
        type: "sales",
      },
      chatId,
      {
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": profile.organization_id,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (result.status !== 200) {
      throw new Error("Failed to upload dataset info");
    }
   if(result.status === 200){
     setS3Key("")
   }
    const response = {
      data: {
       
          text: "Success! Your file has been uploaded successfully. Ask questions regarding the uploaded file.",
          file_path:result?.data?.file_path,
          suggested_questions: result?.data.suggested_questions,
       
      },
     
    };

    let assistantMessage;
    assistantMessage = formQueueMessage(response || "", true,true,"datasetres");

    return assistantMessage;
  } catch (error) {
    console.error(error);
  }
}
