import { ChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { chatService } from "@/services/ChatService";
import { Message } from "@/types";
import { formQueueMessage } from "@/utils/chat.utils";
import { getAccessToken } from "@/utils/storage.utils";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ChatLayout({ children }: { children: React.ReactNode }) {
  const { id: chatId } = useParams();
  const { profile } = useProfile();
  const [analyze,setAnalyze]= useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [queue, setQueue] = useState<Message[]>([]);
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [s3Key, setS3Key] = useState("");

  const addToQueue = useCallback((message: Message) => {
    setQueue((prev: Message[]) => [...prev, message]);
  }, []);
  const [prevMessage,setPrevMessage]=useState<Message[]>([])
  const emptyQueue = () => {
    setQueue([]);
    // setS3Key("");
  };
  const [tokenExpired,setTokenExpired] = useState(false);
 
  const processQueue = useCallback(
    async (handler: (message: Message) => Promise<void>) => {
      if (processing || queue.length === 0) return;

      setProcessing(true);
      const message = queue[queue.length - 1];

      try {
        await handler(message);
        // setQueue((prev) => prev.slice(1));
      } catch (error) {
        console.error("Error processing message:", error);
      } finally {
        setProcessing(false);
      }
    },
    [queue, processing]
  );
  useEffect(()=>{
    if(profile?.tokens_remaining === 0 || profile?.tokens_remaining === null){
      setTokenExpired(true)
    }

  },[profile])

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!chatId || !profile) return;
      if (prevMessage.length === 0) {
        emptyQueue();
      }
      try {
        setIsLoading(true);
        const response = await chatService.getChatHistory(chatId, {
          headers: {
            "x-organization-id": profile.organization_id,
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
      
        if (prevMessage.length === 0 && !s3Key && response?.data?.items.length === 0) {
         
          const emptyChatResponse = {
            data: {
             
                text: "It looks like there’s no history yet. Let’s spark up a new conversation and make something great!",
           
            },
          
          };
  
          // Formulate the assistant message and add it to the queue
          const assistantMessage = formQueueMessage(emptyChatResponse, true,true,"datasetres");
          addToQueue(assistantMessage);
          return; // Early return to stop further processing
        }
         if(response.status == 200){
           setPrevMessage([])
         }
        response?.data?.items.forEach((item) => {
           
          if (item.query_text) {
            const userMessage: Message = {
              id: Date.now().toString(),
              content: item.query_text,
              role: "user",
              timestamp: item.created_at,
              type: "text",
              isTyping: false,
            };
            addToQueue(userMessage);
          }
          // if (item?.results?.file_name && item?.results?.suggested_questions){
          //   const response = {
          //     data: {
              
                 
          //         file_name:item?.results?.file_name,
          //         suggested_questions:item?.results?.suggested_questions,
                
          //     },
             
          //   };
          //   let assistantMessage;
          //   assistantMessage = formQueueMessage(response || "", true, false,"datasetres");
          //   addToQueue(assistantMessage)
          // }
  
          if (item?.results?.results?.response) {
            const assistantMessage = formQueueMessage(
              item.results.results.response.charts
                ? item.results.results.response.charts
                : item.results.results.response || "",
              true,
              false,
              item?.results?.results?.response?.data?.file_path && "datasetres" ,
              item?.results?.timestamp,
            
            );
            addToQueue(assistantMessage);
          }
         
        });
      
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadChatHistory();
  }, [chatId, profile]);
  

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
        emptyQueue,
        s3Key,
        prevMessage,
        setPrevMessage,
        setS3Key,
        isLoading,
        setIsLoading,
        analyze,
        setAnalyze,
        tokenExpired,
        setTokenExpired
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export default ChatLayout;
