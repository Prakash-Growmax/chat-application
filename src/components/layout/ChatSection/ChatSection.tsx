import Chat from "@/components/ChatNew/Chat";
import { ChatContext } from "@/context/ChatContext";
import { useGetChatHistory } from "@/hooks/useGetChatHistory";
import { Message } from "@/types";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

function ChatSection() {
  const { id } = useParams();
  const { data } = useGetChatHistory(id);

  const [isUploading, setIsUploading] = useState(false);
  const [queue, setQueue] = useState<Message[]>(data);
  const [processing, setProcessing] = useState(false);

  const addToQueue = useCallback((message: Message) => {
    setQueue((prev: Message[]) => [...prev, message]);
  }, []);

  const processQueue = useCallback(
    async (handler: (message: Message) => Promise<void>) => {
      if (processing || queue.length === 0) return;

      setProcessing(true);
      const message = queue[0];

      try {
        await handler(message);
        setQueue((prev) => prev.slice(1));
      } catch (error) {
        console.error("Error processing message:", error);
      } finally {
        setProcessing(false);
      }
    },
    [processing, queue]
  );

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
      }}
    >
      <Chat message={data} />
    </ChatContext.Provider>
  );
}

export default ChatSection;
