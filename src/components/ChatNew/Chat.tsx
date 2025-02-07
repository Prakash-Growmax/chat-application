import { useChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { uploadDocumentToChat } from "@/lib/chat/chat-service";
import { ChatState } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ChatBox from "./ChatBox";
import { ChatInput } from "./ChatInput";

function Chat() {
  const { profile } = useProfile();
  const { id: chatId } = useParams();
  const {
    messages: message,
    s3Key,
    setS3Key,
    addToQueue,
    isUploading,
    setIsUploading,
  } = useChatContext();

  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    csvData: null,
    error: null,
    s3Key: null,
  });
  useEffect(() => {
    if (message?.length) {
      const mappedMessages = message?.map((msg) => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.timestamp || Date.now(),
        role: msg.role,
        type: msg.type,
      }));
      const s3ky = "";
      setState((prev) => ({
        ...prev,
        messages: mappedMessages,
        s3Key: s3ky,
        isLoading: false,
        error: null,
      }));
    }
  }, [message]);

  async function uploadDatasetAgainstChat() {
    try {
      if (!chatId || !profile) return null;
      setIsUploading(true);
      const message_res = await uploadDocumentToChat(chatId, s3Key, profile,setS3Key);
      addToQueue(message_res);
      toast.success("File uploaded successfully.");
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    if (s3Key && isUploading) {
      uploadDatasetAgainstChat();
    }
  }, [s3Key, isUploading]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col w-full">
      <ChatBox />

      <div className="mt-auto">
        <div className="py-4">
          <ChatInput
            onFileUploaded={(key) => {
              setState({
                ...state,
                s3Key: key,
                messages: [
                  {
                    id: Date.now().toString(),
                    content:
                      'CSV data loaded successfully! Try asking me questions about the data. Type "help" to see what I can do.',
                    role: "assistant",
                    timestamp: new Date(),
                    type: "text",
                    isTyping: false,
                  },
                ],
              });
            }}
          />
        </div>

        <div className="px-2 pb-2 text-center">
          <div className="text-xs text-gray-500">
            Ansight can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
