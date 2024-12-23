
import { useCallback, useContext, useEffect, useState } from "react";
import GChatterIntro from "./GChatterIntro";
import ChatBox from "./ChatBox";
import { ChatInput } from "./ChatInput";
import AppContext from "../context/AppContext";

import RightSideBar from "../ui/RightSideBar";
import { useMessageQueue } from "@/lib/useMessageQuesue";
import { getResponse } from "@/lib/pandas-api";
import { Message } from "@/types";
import Sidebar from "../ui/sidebar";
import ChatHeader from "./ChatHeader";
interface ChatProps{
  message:(chat:string)=>void
  
}
function Chat({message}:ChatProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { queue, processing, addToQueue, processQueue } = useMessageQueue();
  const { open, setOpen,openRight,setOpenRight,state,setState } = useContext(AppContext);
  // const [state, setState] = useState<ChatState>({
  //   messages: [],
  //   isLoading: false,
  //   csvData: null,
  //   error: null,
  //   s3Key: null,
  // });

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
        console.log("🚀 ~ error:", error);
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
        role:msg.role,
        type:msg.type
      }));
     const s3ky="Recents"
      setState((prev) => ({
        ...prev,
        messages: mappedMessages,// Store the transformed messages
        s3Key:s3ky,
        isLoading: false, // Mark as done
        error: null, // Reset error state
      }));
    }
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
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="relative flex flex-col h-screen max-h-[93vh] overflow-hidden">
        {state.s3Key && (
            <div className="fixed top-30 right-0  w-full flex justify-end items-center z-50 p-2 px-8">
            <ChatHeader openRight={openRight} setOpenRight={setOpenRight} createNewChat={createNewChat} />
            </div>
        )}
    
      
        {!state.s3Key && (
          <div className={openRight ? "translate-x-[-200px]" : ""}>
            <GChatterIntro />
          </div>
        )}
        <Sidebar open={open} setOpen={setOpen} createNewChat={createNewChat}/>
        <RightSideBar openRight={openRight} setOpenRight={setOpenRight} />
        <div
          className={`flex-1 transition-transform duration-300 ease-in-out overflow-y-auto ${
            openRight ? "lg:translate-x-[-300px] lg:px-24" : "translate-x-0"
          }`}
          style={{
            backgroundColor: "#F6F8FA",
          }}
        >
          <ChatBox
            state={state}
            setState={setState}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        </div>
        <div
          className={`flex items-center px-4 bg-[#F6F8FA] sticky bottom-0 left-0 right-0 z-10 py-4 ${
            openRight ? "lg:translate-x-[-200px] lg:w-[1350px] lg:px-16 lg:ml-8" : ""
          }`}
        >
          <div className="flex-1 w-full sm:pl-16 sm:pr-16 lg:pl-48 lg:pr-48 lg:py-2">
          <div className="max-w-[800px] mx-auto w-full">
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
      </div>
    </>
  );
}

export default Chat;
