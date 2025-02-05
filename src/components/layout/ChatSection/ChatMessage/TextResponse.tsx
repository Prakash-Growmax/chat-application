import { Message } from "@/types";
import { useEffect, useState } from "react";
import TypingChatMessage from "./TypingChatMessage";

const TextResponse = ({
  message,
  isAssistant,
}: {
  message: Message;
  isAssistant: boolean;
}) => {
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, message?.content?.length * 30 + 500);

    return () => clearTimeout(timer);
  }, [message?.content]);

  return (
    <TypingChatMessage
      message={{ ...message, isTyping }}
      isAssistant={isAssistant}
    />
  );
};

export default TextResponse;
