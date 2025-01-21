import { useChatContext } from "@/context/ChatContext";
import { ChatState } from "@/types";
import { lazy, useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import ChatBox from "./ChatBox";

const ChatInput = lazy(() =>
  import("./ChatInput").then((module) => ({ default: module.ChatInput }))
);

function Chat() {
  const { messages: message } = useChatContext();
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    csvData: null,
    error: null,
    s3Key: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const { openRight } = useContext(AppContext);

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

  const handleError = (error: string) => {
    setState((prev) => ({ ...prev, error, csvData: null }));
  };

  return (
    <div className="h-[calc(100vh-64px)]  flex flex-col">
      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <ChatBox />
        </div>
      </div>

      <div className="mt-auto">
        <div className="py-4">
          <div className="max-w-4xl mx-auto px-2 sm:px-4">
            <ChatInput
              onSend={() => {}}
              disabled={state.isLoading || !state.s3Key}
              onError={handleError}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              // s3Key={state.s3Key || ""}
             
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
