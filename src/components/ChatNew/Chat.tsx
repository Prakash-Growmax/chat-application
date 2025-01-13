import { lazy, useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { getResponse } from "@/lib/pandas-api";
import { useMessageQueue } from "@/lib/useMessageQuesue";
import { ChatState, Message } from "@/types";
import { styled } from "@mui/material";
import RightSideBar from "../ui/RightSideBar";
import ChatBox from "./ChatBox";
import { useCreateChatId } from "@/hooks/useCreateChat";

// const ChatBox = lazy(() => import("./ChatBox"));
const ChatInput = lazy(() => import("./ChatInput").then(module => ({ default: module.ChatInput })));
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
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: '0.3s',  // Increased duration for smoother feel
  }),
  [theme.breakpoints.down("md")]: {
    marginLeft: open ? "176px" : "0",
    width: open ? `calc(100% - 176px)` : '100%',
  },
  [theme.breakpoints.up("md")]: {
    marginLeft: open ? "100px" : "0",
    width: open ? `calc(100% - 100px)` : '100%',
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
  const { open, setOpen, openRight, setOpenRight } = useContext(AppContext);
  const {chatId} = useCreateChatId(state)
  
 
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
      const mappedMessages = message?.map((msg  ) => ({
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

  return (
    <Main open={open} className="relative max-h-screen p-2 overflow-hidden">
      <div className=" flex flex-col">
        <div className=" w-screen h-[95vh] flex flex-col items-center justify-center">
          <div className="mb-7  text-center @lg/thread:block">
            <div className="relative inline-flex justify-center text-center">
              {!state.s3Key && (
                <h1
                  className="text-[30px] leading-[36px] font-semibold text-[rgb(13,13,13)] lg:mr-0 md:mr-8 mr-12"
                  style={{
                    fontFamily:
                      'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
                  }}
                >
                  What do you want to analyze today ?
                </h1>
              )}
            </div>
          </div>
          {Boolean(state?.messages?.length > 0) && (
            <div
              className={`flex-1 items-center justify-center overflow-y-auto lg:mr-0 md:mr-12 `}
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
          <div
            className={`text-base px-3 w-full md:px-5 lg:px-4 xl:px-5 pb-4 lg:mr-0 md:mr-8 ${
              state.s3Key ? "" : "mr-12"
            }`}
          >
            <div className="mx-auto max-w-4xl flex flex-1">
              {/* <div className="mx-auto flex flex-1 gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl"> */}{" "}
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
        <div className="w-full px-2 pb-2 text-center text-xs text-gray-500">
          <div>
            <div>Ansight can make mistakes. Check important info.</div>
          </div>
        </div>
      </div>

      {/* {!isMobile && !isTab && (
        <Sidebar open={open} setOpen={setOpen} createNewChat={createNewChat} />
      )} */}

      <RightSideBar openRight={openRight} setOpenRight={setOpenRight} />
    </Main>
  );
}

export default Chat;
