import { getResponse } from "@/lib/pandas-api";
import { useMessageQueue } from "@/lib/useMessageQuesue";
import { ChatState, Message } from "@/types";
import { styled } from "@mui/material";
import { lazy, useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import ChatBox from "./ChatBox";

const ChatInput = lazy(() =>
  import("./ChatInput").then((module) => ({ default: module.ChatInput }))
);
interface ChatProps {
  message: (chat: string) => void;
}
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: "0.3s",
  }),
  [theme.breakpoints.up("md")]: {
    marginLeft: open ? "100px" : "0",
    width: open ? `calc(100% - 100px)` : "100%",
  },
}));

function Chat({ message }: ChatProps) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    csvData: null,
    error: null,
    s3Key: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const { queue, processing, addToQueue, processQueue } = useMessageQueue();
  const { sideDrawerOpen, openRight } = useContext(AppContext);

  const processMessage = useCallback(
    async (message: Message) => {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
        isLoading: true,
        error: null,
      }));

      try {
        const result = await fetch(
          "https://pandasai-production.up.railway.app/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              s3_key: state.s3Key,
              query: message?.content,
            }),
          }
        );
        if (!result.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await result.json();

        const response = await getResponse(message.content, data?.response!);
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, response],
          isLoading: false,
          error: null,
          csvData: data?.response,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              id: Date.now().toString(),
              content: "Unable to respond right now.",
              role: "assistant",
              timestamp: new Date(),
              type: "text",
            },
          ],
          isLoading: false,
        }));
      }
    },
    [state.s3Key]
  );

  const handleSendMessage = async (content: string) => {
    if (!state.s3Key) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      type: "text",
    };

    addToQueue(userMessage);
  };

  useEffect(() => {
    if (message?.length) {
      const mappedMessages = message?.map((msg) => ({
        id: msg.id, // Example of mapping fields
        content: msg.content, // Assuming the structure of each message
        timestamp: msg.timestamp || Date.now(),
        role: msg.role,
        type: msg.type,
      }));
      const s3ky = "Recents";
      setState((prev) => ({
        ...prev,
        messages: mappedMessages, // Store the transformed messages
        s3Key: s3ky,
        isLoading: false, // Mark as done
        error: null, // Reset error state
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const handleError = (error: string) => {
    setState((prev) => ({ ...prev, error, csvData: null }));
  };

  useEffect(() => {
    if (!processing && queue.length > 0) {
      processQueue(processMessage);
    }
  }, [processing, queue, processQueue, processMessage]);
  const hasMessages = Boolean(state?.messages?.length > 0);

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
              onSend={handleSendMessage}
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
              onSend={handleSendMessage}
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
