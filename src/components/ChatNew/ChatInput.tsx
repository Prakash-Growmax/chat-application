import { useChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { createChatId } from "@/lib/chat/chat-service";
import { chatService } from "@/services/ChatService";
import { Message } from "@/types";
import { formQueueMessage } from "@/utils/chat.utils";
import { getAccessToken, tokenType } from "@/utils/storage.utils";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LucideIcon from "../Custom-UI/LucideIcon";
import ChatUploadBtn from "../layout/ChatSection/ChatUpload/ChatUploadBtn";
import AppContext from "../context/AppContext";
import { toast } from "sonner";
import { useMediaQuery, useTheme } from "@mui/material";

interface ChatInputProps {
  onFileUploaded?: (s3Key: string) => void;
  isNewChat?: boolean;
}

export function ChatInput({
  onFileUploaded,
  isNewChat = false,
}: ChatInputProps) {
  //hooks...
  const { id: chat_id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const {
    addToQueue,
    processing,
    setProcessing,
    queue,
    processQueue,
    s3Key,
    setPrevMessage,
    isUploading,
    analyze,
    setAnalyze,
    tokenExpired
  } = useChatContext();
  const [input, setInput] = useState("");
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));

  const containerRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {setHistoryList} = useContext(AppContext)
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const maxHeight = s3Key ? 120 : 200;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [s3Key]);
 
  function addUserQueue(value: string | number) {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: value,
      role: "user",
      timestamp: new Date(),
      type: "text",
      isTyping: false,
    };
    addToQueue(userMessage);
    if (location.pathname == "/chat/new") {
      setPrevMessage((prev: Message[]) => [...prev, userMessage]);
    }
  }

  const handleSubmit = async (e: string | number) => {
   
    e.preventDefault();
    if (!Boolean(input.trim())) return;
    const value = input.trim() || "";
    setInput("");
    if (isNewChat && profile && ((!isUploading || !analyze) && !tokenExpired)) {
     
     try {
        setProcessing(true);
        addUserQueue(value);
        const ChatId = await createChatId(profile,setHistoryList);
        setProcessing(false);
        navigate(`/chat/${ChatId}`);
        return;
      } catch (error) {
        console.error(error);
        setProcessing(false);
        return;
      }
    } else {
      if(!isUploading && !analyze && !tokenExpired){
      
        addUserQueue(value);
      }
      else{
        toast((isUploading || analyze) ? "Please wait while we process your query" : "Your session has expired", {
          position: (isMobile || isTab) ? "top-center" : "bottom-center", // Display at the top for mobile, bottom for others
        });
      }
    
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
    
      e.preventDefault();
      if(!isUploading){
        handleSubmit(e);
      }
    
    }
  };
  const processMessage = async (message: Message) => {
    try {
      if (!chat_id) return;
      if (queue[queue.length - 1]?.role !== "user") return; // Add this check
      if (profile?.organization_id && user?.id) {
        const org_id = profile.organization_id;
         setAnalyze(true);
        const result = await chatService.analyzeQuery(
          chat_id,
          {
            org_id,
            query: message.content,
            user_id: user?.id,
            chat_id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-organization-id": org_id,
              Authorization: `${tokenType} ${getAccessToken()}`,
            },
          }
        );
     
        if (result?.data?.error) {
          throw new Error(result?.data?.error);
        }
    
        let assistantMessage;
        assistantMessage = formQueueMessage(
          result?.data?.results?.response?.charts?.charts
            ? result?.data?.results?.response?.charts?.charts
            : result?.data?.results?.response || "",
          true
        );
        addToQueue(assistantMessage);
        setAnalyze(false)
      }
    } catch (error) {
      let ErrorMsg =
        error instanceof Error
          ? error?.message === "500: "
            ? `I apologize, but I encountered an error while processing your request. You can:\n
            • Try sending your message again\n
            • Rephrase your question\n
            • Start a new conversation`
            : "An unexpected error occurred."
          : "An unexpected error occurred.";

      const errorMessage: Message = {
        id: Date.now().toString(),
        content: ErrorMsg,
        role: "assistant",
        timestamp: new Date(),
        type: "text",
        isTyping: false,
      };
      addToQueue(errorMessage);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (!processing && queue.length > 0 && mounted && !isUploading) {
      processQueue(processMessage);
    }

    return () => {
      mounted = false;
    };
  }, [processing, processQueue]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight, s3Key]);

  useEffect(() => {
    if (s3Key) {
      containerRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [s3Key]);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 w-full">
      <div className="flex justify-center">
        <form className="w-full" onSubmit={handleSubmit} ref={containerRef}>
          <div className="relative flex h-full max-w-full flex-1 flex-col">
            <div className="group relative flex w-full items-center">
              <div className="w-full">
                <div
                  id="composer-background"
                  className="flex w-full cursor-text flex-col rounded-3xl px-2.5 py-1 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.1),0_-1px_2px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex min-h-[44px] items-start pl-2">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        adjustTextareaHeight();
                      }}
                      placeholder="Attach a file to kick off the conversation..."
                      className="block h-10 w-full resize-none border-0 bg-transparent px-0 py-2 text-base text-token-text-primary placeholder:text-gray-500 focus:outline-none"
                      onKeyDown={handleKeyDown}
                    />
                  </div>

                  <div className="flex h-[44px] items-center justify-between">
                    <div className="flex gap-x-1">
                      <ChatUploadBtn onFileUploaded={onFileUploaded} />
                    </div>

                    <button
                      type="submit"
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        input && !isUploading && !analyze && !tokenExpired
                          ? "bg-black text-white hover:opacity-70"
                          : "bg-[#D7D7D7] text-[#f4f4f4]"
                      }`}
                     
                    >
                      <LucideIcon name={"ArrowUp"} size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
