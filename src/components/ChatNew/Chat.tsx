import { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import ChatBox from "./ChatBox";
import { ChatInput } from "./ChatInput";
import GChatterIntro from "./GChatterIntro";

import { getResponse } from "@/lib/pandas-api";
import { useMessageQueue } from "@/lib/useMessageQuesue";
import { Message } from "@/types";
import RightSideBar from "../ui/RightSideBar";
import Sidebar from "../ui/sidebar";
import ChatHeader from "./ChatHeader";
import { styled, useMediaQuery, useTheme } from "@mui/material";
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
  padding: theme.spacing(3),
  // transition: theme.transitions.create("margin", {
  //   easing: theme.transitions.easing.sharp,
  //   duration: theme.transitions.duration.leavingScreen,
  // }),
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
  const { open, setOpen, openRight, setOpenRight, state, setState } = useContext(AppContext);

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
    <Main open={open} style={{background:"#F6F8FA"}}>
      <div className="relative -mt-8 flex flex-col h-screen max-h-[90vh] overflow-hidden" style={{background:"#F6F8FA"}}>
        <div className="mb-14 w-full">
          <div
            className="fixed top-30 right-0 w-full flex justify-end items-center z-50 p-2 px-4"
            style={{ backgroundColor: "#F6F8FA" }}
          >
            <ChatHeader
              open={open}
              setOpen={setOpen}
              openRight={openRight}
              setOpenRight={setOpenRight}
              createNewChat={createNewChat}
              state={state}
            />
          </div>
        </div>

        {!state.s3Key && (
         <div className="relative w-screen h-screen flex flex-col">
         <div className="fixed -top-40 left-0 mr-4 w-full h-full flex items-center justify-center">
           <GChatterIntro />
         </div>
        
       </div>
        )}
     
     
        <div
          className={`flex-1 items-center justify-center overflow-y-auto  ${openRight ? "mr-80" : ""}`}
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
        <div
  className={`${
    state.s3Key
      ?  `flex items-center justify-center  ${openRight ? "mr-80" : ""}`
      : `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[80%] px-4`
  }`}
  
> 
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
     
       
     {!isMobile && !isTab && (<Sidebar open={open} setOpen={setOpen} createNewChat={createNewChat}/>)} 
    
      <RightSideBar openRight={openRight} setOpenRight={setOpenRight} />
     
    
    </Main>
  );
}

export default Chat;
