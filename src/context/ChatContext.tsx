import { Message } from "@/types";
import { createContext, useContext } from "react";

interface ChatContextType {
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  queue: Message[];
  setQueue: (value: (prev: Message[]) => Message[]) => void;
  processing: boolean;
  setProcessing: (value: boolean) => void;
  addToQueue: (message: Message) => void;
  emptyQueue: () => void;
  processQueue: (handler: (message: Message) => Promise<void>) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
