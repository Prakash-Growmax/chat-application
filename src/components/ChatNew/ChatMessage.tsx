import { Message } from "@/types";
import { useState } from "react";

import PaperCard from "../Custom-UI/PaperCard";
import ChartResponse from "../layout/ChatSection/ChatMessage/ChartResponse";
import DatasetUploadResponse from "../layout/ChatSection/ChatMessage/DatasetUploadResponse";
import GreetingResponse from "../layout/ChatSection/ChatMessage/GreatingResponse";
import InsighttResponse from "../layout/ChatSection/ChatMessage/InsightResponse";
import TextResponse from "../layout/ChatSection/ChatMessage/TextResponse";
import { Dialog, DialogContent } from "../ui/dialog";
import ChatAssistantHeader from "./ChatMessage/ChatAssistantHeader";
import ChatTimeStamp from "./ChatMessage/ChatTimeStamp";
import ChatTypeInfo from "./ChatMessage/ChatTypeInfo";
import { DataChart } from "./DataChat";
import GeneralResponse from "../layout/ChatSection/ChatMessage/GeneralResponse";

import { useMediaQuery, useTheme } from "@mui/material";

interface ChatMessageProps {
  message: Message;
  onContentChange: () => void;
 
}
export function ChatMessage({
  message = {
    role: "assistant",
    timestamp: new Date(),
    messageObject: {
      timeStamp: new Date(),
    },
    type: "text",
  },
  onContentChange,
}: ChatMessageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isUser = message?.role === "user";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  
 
  const timeStamp = message?.timestamp
    ? message?.timestamp
    : message?.messageObject?.timestamp || "";
 
  return (
    <>
      <div className="mx-auto max-w-4xl h-full">
        {isUser ? (
          <div className="flex w-full items-center justify-center py-2">
            <PaperCard className="w-full border-none rounded-3xl p-3">
              <div
                className="w-full border-none"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <ChatTypeInfo isUser={isUser} />
                <div className="ml-1">
                  <RenderContent
                    message={message}
                    isAssistant={!isUser}
                    onContentChange={onContentChange}
                  />
                  {(!isMobile || isTab) && (
                     <ChatTimeStamp
                     timeStamp={timeStamp || ""}
                     isHovering={isHovering}
                   />
                  )}
                 
                </div>
              </div>
            </PaperCard>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center py-2">
            <PaperCard className="w-full border-none rounded-3xl p-3">
              <ChatAssistantHeader />
              <div
                className="ml-1"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <RenderContent
                  message={message}
                  onContentChange={onContentChange}
                />
                {(!isMobile || isTab) && ( <ChatTimeStamp
                  timeStamp={timeStamp || ""}
                  isHovering={isHovering}
                />)}
               
              </div>
            </PaperCard>
          </div>
        )}
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] overflow-auto">
          {message?.type === "chart" && <DataChart data={message?.data} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

const RenderContent = ({
  message,
  isAssistant = false,
  onContentChange,
}: {
  message: Message;
  isAssistant?: boolean;
  onContentChange: () => void;
}) => {
  if (message?.type === "text") {
    return <TextResponse message={message} isAssistant={isAssistant} />;
  }
  if(message?.messageObject?.content?.type == "generic_summary"){
    return( 
      <GeneralResponse
      message={message?.messageObject?.content?.analysis}
      isTyping={message?.messageObject?.isTyping}
      isAssistant={message?.messageObject?.role}
      onContentChange={onContentChange}
      />
    )
   
  }
  if (message?.messageObject?.content?.type === "text") {
    return (
      <GreetingResponse
        message={message?.messageObject?.content?.data?.response ? message?.messageObject?.content?.data?.response : message?.messageObject?.content?.content?.analysis?.key_insight }
        isTyping={message?.messageObject?.isTyping}
        isAssistant={message?.messageObject?.role}
        onContentChange={onContentChange}
      />
    );
  }
  if (message?.messageObject?.type === "datasetres") {
    return (
      <DatasetUploadResponse
        message={message?.messageObject?.content?.data}
        isTyping={message?.messageObject?.isTyping}
        isAssistant={message?.messageObject?.role}
        onContentChange={onContentChange}
      />
    );
  }
  if (message?.messageObject?.content?.type === "insights") {
    return (
      <InsighttResponse
        data={message?.messageObject.content.data}
        isTyping={message?.messageObject?.isTyping}
        isAssistant={message?.messageObject?.role}
        onContentChange={onContentChange}
      />
    );
  }
  if (message?.messageObject?.content?.charts?.type === "chart" || message?.messageObject?.content?.type === "chart") {
    return (
      <ChartResponse
        data={message?.messageObject.content.charts ? message?.messageObject.content.charts.data :  message?.messageObject.content.data  }
        layout={message?.messageObject.content.charts ? message?.messageObject.content.charts.layout : message?.messageObject.content.layout}
        summary={message?.messageObject.content.charts ? message?.messageObject.content.charts.analysis : message?.messageObject.content.analysis}
        isTyping={message?.messageObject?.isTyping}
        isAssistant={message?.messageObject?.role}
        onContentChange={onContentChange}
      />
    );
  }
};
