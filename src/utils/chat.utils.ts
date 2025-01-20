import { Message } from "@/types";

export const formQueueMessage = (
  content: string,
  isAssistant: boolean,
  additionalParams?: object
) => {
  const message: Message = {
    id: Date.now().toString(),
    content: content,
    role: isAssistant ? "assistant" : "user",
    timestamp: new Date(),
    type: "text",
    ...additionalParams,
  };

  return message;
};
