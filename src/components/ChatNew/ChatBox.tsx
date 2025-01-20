import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";

import { useChatContext } from "@/context/ChatContext";
import ChatLoader from "./ChatLoader";
import { ChatMessage } from "./ChatMessage";

export default function ChatBox() {
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
    <>
      <div className="min-h-screen">
        <div className="flex h-screen">
          {/* Main Content */}
          <div className="flex flex-col w-svw">
            <main className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.5, // Smoother transitions
                    ease: "easeInOut",
                  }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex flex-col h-screen">
                    <div className="w-full md:w-full max-w-[100%] mx-auto h-full items-center justify-center">
                      <ScrollArea
                        ref={scrollAreaRef}
                        className="flex-1 px-4 overflow-auto my-4 items-center scroll-container"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: "easeInOut",
                          }}
                          className="mx-auto"
                        >
                          {queue?.map((message) => (
                            <ChatMessage message={message} />
                          ))}

                          <ChatLoader />

                          {/* Invisible div to help with scrolling */}
                          <div ref={messagesEndRef} />
                        </motion.div>
                      </ScrollArea>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
