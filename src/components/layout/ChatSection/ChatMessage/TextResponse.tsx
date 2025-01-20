import { Message } from "@/types";
import { useEffect, useState } from "react";
import TypingChatMessage from "./TypingChatMessage";

const TextResponse = ({ message }: { message: Message }) => {
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, message.content.length * 30 + 500);

    return () => clearTimeout(timer);
  }, [message.content]);

  return <TypingChatMessage message={{ ...message, isTyping }} />;
};

export default TextResponse;
