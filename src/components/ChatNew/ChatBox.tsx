import { useMessageQueue } from "@/lib/useMessageQuesue";
import { ChatState } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { ScrollArea } from "../ui/scroll-area";

import LinearIndeterminate from "../ui/LinearProgress";
import { ChatMessage } from "./ChatMessage";
import DarkLogo from "@/assets/Logo/DarkLogo";

interface ChatBoxProps {
  state: ChatState;
  setState: (state: ChatState) => void;
  isUploading: boolean;
  setIsUploading: (state: boolean) => void;

}

export default function ChatBox({
  state,
  
}: ChatBoxProps) {
  const { queue, processing, addToQueue, processQueue } = useMessageQueue();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth", // Smooth scrolling
        block: "nearest",   // Subtle alignment
      });
    }
  }, []);

  // Effect to scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  return (
    <>
      <div className="min-h-screen">
        <div className="flex h-screen">
          {/* Main Content */}
          <div className="flex flex-col w-screen">
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
                          {state.messages.map((message) => (
                            <ChatMessage
                              key={message.id}
                              message={message}
                              state={state}
                             
                            />
                          ))}

                          {state.isLoading && (
                            <div className="flex items-center justify-center">
                              <div className="flex flex-col max-w-8xl lg:w-[61%] md:w-[97%] w-[100%]">
                                <div className="flex">
                                  <div className="flex w-[95%] h-[20%] mt-4">
                                    <DarkLogo />
                                  </div>
                                </div>
                                <div className="flex w-full px-4 py-2">
                                  <div className="flex flex-col w-[100%]">
                                    <div className="mb-4">
                                      <LinearIndeterminate />
                                    </div>
                                    <LinearIndeterminate />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

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

        {state.error && (
          <Alert
            variant="destructive"
            className="fixed bottom-4 right-4 w-auto"
          >
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
