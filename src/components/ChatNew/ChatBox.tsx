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
      // Force a re-layout update before scrolling
      setTimeout(() => {
        scrollAreaRef.current!.scrollTop = 0;
      }, 0); // Use a minimal delay to ensure the DOM is updated
    }
  }, []);

  // Scroll to bottom when queue or processing changes
  useEffect(() => {
    scrollToBottom();
  }, [queue, processing, scrollToBottom]);

  // Scroll to bottom when processing is complete and it's not a new chat
  useEffect(() => {
    if (!isNewChat && !processing) {
      scrollToBottom();
    }
  }, [processing, isNewChat, scrollToBottom]);

  // Scroll to top when the id changes
  useEffect(() => {
    scrollToTop();
  }, [id, scrollToTop]);

  return (
    <div className="flex-1 overflow-y-auto" key={id}> {/* Force re-render when id changes */}
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