import { useChatContext } from "@/context/ChatContext";
import { ChatState } from "@/types";
import { lazy, useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import ChatBox from "./ChatBox";

const ChatInput = lazy(() =>
  import("./ChatInput").then((module) => ({ default: module.ChatInput }))
);
interface ChatProps {
  message: (chat: string) => void;
}

function Chat({ message }: ChatProps) {
  const { queue } = useChatContext();
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
      const s3ky = "Recents";
      setState((prev) => ({
        ...prev,
        messages: mappedMessages,
        s3Key: s3ky,
        isLoading: false,
        error: null,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const handleError = (error: string) => {
    setState((prev) => ({ ...prev, error, csvData: null }));
  };
  const hasMessages = Boolean(queue?.length > 0);

  if (!hasMessages) {
    return (
      <div className="h-[calc(100vh-64px)]  flex flex-col">
        {/* Centered content when no messages */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">
            What do you want to analyze today?
          </h1>

          <div className="w-full max-w-4xl px-4">
            <ChatInput
              // onSend={handleSendMessage}
              disabled={state.isLoading || !state.s3Key}
              onError={handleError}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              s3Key={state.s3Key || ""}
              bucket={import.meta.env.VITE_S3_BUCKET_NAME}
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
                    },
                  ],
                });
              }}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="px-2 pb-2 text-center">
          <div className="text-xs text-gray-500">
            Ansight can make mistakes. Check important info.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)]  flex flex-col">
      {/* Messages section - scrollable */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="max-w-4xl mx-auto">
          <ChatBox
            state={state}
            setState={setState}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            openRight={openRight}
          />
        </div>
      </div>

      {/* Footer section with input and disclaimer - fixed at bottom */}
      <div className="mt-auto">
        <div className="px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              // onSend={handleSendMessage}
              disabled={state.isLoading || !state.s3Key}
              onError={handleError}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              s3Key={state.s3Key || ""}
              bucket={import.meta.env.VITE_S3_BUCKET_NAME}
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
                    },
                  ],
                });
              }}
            />
          </div>
        </div>

        {/* Disclaimer */}
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
