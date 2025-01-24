import { Message } from "@/types";
import { useState } from "react";

import PaperCard from "../Custom-UI/PaperCard";
import ChartResponse from "../layout/ChatSection/ChatMessage/ChartResponse";
import DatasetUploadResponse from "../layout/ChatSection/ChatMessage/DatasetUploadResponse";
import InsighttResponse from "../layout/ChatSection/ChatMessage/InsightResponse";
import TextResponse from "../layout/ChatSection/ChatMessage/TextResponse";
import { Dialog, DialogContent } from "../ui/dialog";
import ChatAssistantHeader from "./ChatMessage/ChatAssistantHeader";
import ChatTypeInfo from "./ChatMessage/ChatTypeInfo";
import { DataChart } from "./DataChat";

interface ChatMessageProps {
  message: Message;
  onContentChange: (content: any) => void
}
export function ChatMessage({ message, onContentChange }: ChatMessageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isUser = message.role === "user";

  return (
    <>
      <div className="mx-auto max-w-4xl h-full">
        {isUser ? (
          <div className="flex w-full items-center justify-center py-2">
            <PaperCard className="w-full border-none rounded-3xl p-3">
              <div className="w-full border-none">
                <ChatTypeInfo isUser={isUser} />
                <div className="ml-1">
                  {/* Pass onContentChange here */}
                  <RenderContent
                    message={message}
                    isAssistant={!isUser}
                    onContentChange={onContentChange}
                  />
                </div>
              </div>
            </PaperCard>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center py-2">
            <PaperCard className="w-full border-none rounded-3xl p-3">
              <ChatAssistantHeader />
              <div className="ml-1">
                {/* Pass onContentChange here */}
                <RenderContent message={message} onContentChange={onContentChange} />
              </div>
            </PaperCard>
          </div>
        )}
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] overflow-auto">
          {message.type === "chart" && <DataChart data={message.data} />}
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
  onContentChange: (content: any) => void;
}) => {
  if (message.type === "text") {
    return <TextResponse message={message} isAssistant={isAssistant} />;
  }
  if (message?.messageObject?.content?.type === "text") {
    return (
      <DatasetUploadResponse
        message={message?.messageObject?.content?.data?.response}
      />
    );
  }
  if (message?.messageObject?.content?.type === "insights") {
    return (
      <InsighttResponse
        data={message.messageObject.content.data}
        onContentChange={onContentChange}
      />
    );
  }
  if (message?.messageObject?.content?.type === "bar") {
    return (
      <ChartResponse
        data={message.messageObject.content.data}
        layout={message.messageObject.content.layout}
        summary={message.messageObject.content.summary}
        onContentChange={onContentChange}
      />
    );
  }
};
