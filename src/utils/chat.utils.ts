import { Message } from "@/types";

export const formQueueMessage = (
  content: object,
  isAssistant: boolean,
  isTyping: boolean = true,
  types:string="text",
  timestamp: Date = new Date(),
 
  additionalParams?: object, 
  
): { messageObject: Message; messageStringOrObject: string | object } => {
  const message: Message = {
    id: Date.now().toString(),
    content: content,
    role: isAssistant ? "assistant" : "user",
    timestamp:timestamp,
    isTyping:isTyping,
    type:types,
    ...additionalParams,
  };

  // Decide how to represent `content` dynamically
  const messageStringOrObject = typeof content === "string" ? content : content;

  // Return both formats
  return { messageObject: message, messageStringOrObject };
};

