import { ChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { chatService } from "@/services/ChatService";
import { Message } from "@/types";
import { getAccessToken } from "@/utils/storage.utils";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ChatLayout({ children }: { children: React.ReactNode }) {
  const { id: chatId } = useParams();
  const { profile } = useProfile();

  const [isUploading, setIsUploading] = useState(false);
  const [queue, setQueue] = useState<Message[]>([]);
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [s3Key,setS3Key]=useState("");
  const addToQueue = useCallback((message: Message) => {
    setQueue((prev: Message[]) => [...prev, message]);
  }, []);

  const emptyQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const processQueue = useCallback(
    async (handler: (message: Message) => Promise<void>) => {
      if (processing || queue.length === 0) return;

      setProcessing(true);
      const message = queue[queue.length - 1];

      try {
        await handler(message);
        // setQueue((prev) => prev.slice(1));
      } catch (error) {
        console.error("Error processing message:", error);
      } finally {
        setProcessing(false);
      }
    },
    [queue, processing]
  );

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!chatId || !profile) return;

      try {
        setIsLoading(true);
        const response = await chatService.getChatHistory(chatId, {
          headers: {
            "x-organization-id": profile.organization_id,
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
        // if (response?.data) {
        //   setQueue(response.data);
        // }
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [chatId, profile]);

  return (
    <ChatContext.Provider
      value={{
        isUploading,
        setIsUploading,
        queue,
        setQueue,
        processing,
        setProcessing,
        addToQueue,
        processQueue,
        emptyQueue,
        s3Key,
        setS3Key
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatLayout;
