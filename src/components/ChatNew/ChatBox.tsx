
import { useMessageQueue } from "@/lib/useMessageQuesue";
import { ChatState } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { ScrollArea } from "../ui/scroll-area";

import LinearIndeterminate from "../ui/LinearProgress";
import { ChatMessage } from "./ChatMessage";

interface ChatBoxProps {
    state: ChatState;
    setState: (state: ChatState) => void;
    isUploading: boolean;
    setIsUploading: (state: boolean) => void;

  
  }
export default function ChatBox({
    state,
    setState,
    isUploading,
    setIsUploading,
  
  }: ChatBoxProps) {
    const { queue, processing, addToQueue, processQueue } = useMessageQueue();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
   
    const scrollToBottom = useCallback(() => {
      if (messagesEndRef.current) {
        // Use a small delay to prevent immediate scrolling
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'nearest' // This helps with more subtle scrolling
          });
        }, 100); // Small delay to prevent jarring scroll
      }
    }, []);
    // Effect to scroll to bottom when messages change
    useEffect(() => {
      scrollToBottom();
    }, [state.messages, scrollToBottom]);
  
    const handleError = (error: string) => {
      setState((prev) => ({ ...prev, error, csvData: null }));
    };
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
                    className="flex-1 flex flex-col"
                  >
                    <div className="flex flex-col h-screen">
                    
                      {/* {!state.s3Key && <GChatterIntro />} */}
                   
                  
                      
  
                      <div className="w-full md:w-full max-w-[100%] mx-auto h-full items-center justify-center">
                        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 overflow-auto my-4 items-center">
                          <div className="mx-auto space-y-6">
                            {state.messages.map((message) => (
                              <ChatMessage 
                                key={message.id} 
                                message={message} 
                                state={state}
                             
                              />
                            ))}
  
                            {state.isLoading && (
                              <>
                                <div className="flex lg:ml-72">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground -mt-2">
                                    <Bot className="w-6 h-6" />
                                  </div>
                                  <div className="font-bold text-sm ml-2">
                                    <p>Assistant G-Chatter</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center">
                                  <div className="flex flex-col w-1/2">
                                    <div className="mb-4">
                                      <LinearIndeterminate />
                                    </div>
                                    <LinearIndeterminate />
                                  </div>
                                </div>
                              </>
                            )}
  
                            {/* Invisible div to help with scrolling */}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </div>
  
          {state.error && (
            <Alert variant="destructive" className="fixed bottom-4 right-4 w-auto">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </div>
      </>
    );
  }