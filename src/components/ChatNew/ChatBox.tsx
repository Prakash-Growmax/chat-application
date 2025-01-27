import { useCallback, useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";

import { useChatContext } from "@/context/ChatContext";
import ChatLoader from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";

export default function ChatBox({
  isNewChat = false,
}: {
  isNewChat?: boolean;
}) {
  const { queue, processing } = useChatContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, []);

  // Scroll to bottom when new message or loader appears
  useEffect(() => {
    scrollToBottom();
  }, [queue, processing, scrollToBottom]); // triggers scroll when queue or processing changes

  // Scroll to bottom when `processing` state changes (ChatLoader visibility)
  useEffect(() => {
    if (!isNewChat && !processing) {
      scrollToBottom();  // Scroll to bottom when loader is shown or when processing ends
    }
  }, [processing, isNewChat, scrollToBottom]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="min-h-screen">
          <div className="flex h-screen">
            <div className="flex flex-col w-svw">
              <main className="flex-1 flex flex-col">
                <div className="flex flex-col h-screen">
                  <div className="w-full md:w-full max-w-[100%] mx-auto h-full items-center justify-center">
                    <ScrollArea
                      ref={scrollAreaRef}
                      className="flex-1 px-1 overflow-auto my-4 items-center scroll-container"
                    >
                      {queue?.map((message, index) => (
                        <ChatMessage
                          key={index}
                          message={message}
                          onContentChange={scrollToBottom} // Trigger scroll on content change
                        />
                      ))}
                      {!isNewChat && <ChatLoader />}  {/* Show loader when not a new chat */}
                      <div ref={messagesEndRef} />  {/* Ensure scroll to bottom when content ends */}
                    </ScrollArea>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
