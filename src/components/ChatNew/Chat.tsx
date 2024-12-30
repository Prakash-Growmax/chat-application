import { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";

import { getResponse } from "@/lib/pandas-api";
import { useMessageQueue } from "@/lib/useMessageQuesue";
import { Message } from "@/types";
import { styled, useMediaQuery, useTheme } from "@mui/material";
import RightSideBar from "../ui/RightSideBar";
import Sidebar from "../ui/sidebar";
import ChatBox from "./ChatBox";
import { ChatInput } from "./ChatInput";
interface ChatProps {
  message: (chat: string) => void;
}
const drawerWidth = 280;
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  [theme.breakpoints.down("md")]: {
    marginLeft: open ? "176px" : "", // Adjust the values as needed for mid-sized screens
  },

  [theme.breakpoints.up("md")]: {
    marginLeft: open ? "176px" : "", // Default value for screens larger than "md"
  },
}));
function Chat({ message }: ChatProps) {
  const [isUploading, setIsUploading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const { queue, processing, addToQueue, processQueue } = useMessageQueue();
  const { open, setOpen, openRight, setOpenRight, state, setState } =
    useContext(AppContext);

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

  function createNewChat() {
    setState({
      messages: [],
      isLoading: false,
      csvData: null,
      error: null,
      s3Key: null,
    });
  }
  useEffect(() => {
    if (message?.length) {
      const mappedMessages = message.map((msg) => ({
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

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Get the width of the viewport
      const viewportWidth = window.innerWidth;

      // Calculate the threshold (e.g., 20% of viewport width)
      const threshold = viewportWidth * 0.2;

      // If mouse is within threshold from left edge, open sidebar
      if (event.clientX <= threshold) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    // Add event listener
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Main open={open} className="relative max-h-screen p-2 overflow-hidden">
      <div className=" flex flex-col">
        <div className=" w-screen h-[95vh] flex flex-col items-center justify-center">
          <div className="mb-7  text-center @lg/thread:block">
            <div className="relative inline-flex justify-center text-center">
              {!state.s3Key && (
                <h1
                  className="text-[30px] leading-[36px] font-semibold text-[rgb(13,13,13)]"
                  style={{
                    fontFamily:
                      'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
                  }}
                >
                  What can I help with?
                </h1>
              )}
            </div>
          </div>
          {Boolean(state?.messages?.length > 0) && (
            <div
              className={`flex-1 items-center justify-center overflow-y-auto  ${
                openRight ? "mr-80" : ""
              }`}
              // style={{
              //   backgroundColor: "#F6F8FA",
              // }}
            >
              <ChatBox
                state={state}
                setState={setState}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                openRight={openRight}
              />
            </div>
          )}
          <div className="text-base px-3 w-full md:px-5 lg:px-4 xl:px-5 pb-8">
            <div className="mx-auto flex flex-1 gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl">
              {" "}
              <ChatInput
                onSend={handleSendMessage}
                disabled={state.isLoading || !state.s3Key}
                onError={handleError}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                s3Key={state.s3Key || ""}
                bucket={import.meta.env.VITE_S3_BUCKET_NAME}
                onFileUploaded={(key: string) => {
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
        </div>
        <div className="w-full px-2 pb-4 text-center text-xs text-gray-500">
          <div>
            <div>Chat AI can make mistakes. Check important info.</div>
          </div>
        </div>
      </div>

      {!isMobile && !isTab && (
        <Sidebar open={open} setOpen={setOpen} createNewChat={createNewChat} />
      )}

      <RightSideBar openRight={openRight} setOpenRight={setOpenRight} />
    </Main>
  );
}

export default Chat;
