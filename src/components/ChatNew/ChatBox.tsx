import { useCallback, useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useChatContext } from "@/context/ChatContext";
import ChatLoader from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";
import { useParams } from "react-router-dom";

export default function ChatBox({
  isNewChat = false,
}: {
  isNewChat?: boolean;
}) {
  const { queue, processing } = useChatContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { id } = useParams(); // Get the id from the route

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        scrollAreaRef.current!.scrollTop = 0;
      }, 0);
    }
  }, []);

  // Handle scroll behavior when queue or processing changes
  useEffect(() => {
    if (isNewChat || !processing) {
      // Fix scroll at the top when isNewChat is true or processing is false
      scrollToTop();
    } else {
      // Otherwise, scroll to bottom for normal chat updates
      scrollToBottom();
    }
  }, [queue, processing, isNewChat, scrollToTop, scrollToBottom]);

  // Scroll to top when the chat ID changes
  useEffect(() => {
    scrollToTop();
  }, [id, scrollToTop]);

  return (
    <div className="flex-1 overflow-y-auto" key={id}>
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
                          onContentChange={scrollToBottom}
                        />
                      ))}
                      <ChatLoader />
                      <div ref={messagesEndRef} />
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
