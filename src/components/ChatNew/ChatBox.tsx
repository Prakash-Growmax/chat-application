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
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [queue, scrollToBottom]);

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
                      {queue?.map((message) => (
                        <ChatMessage message={message} />
                      ))}
                      {!isNewChat && <ChatLoader />}
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
