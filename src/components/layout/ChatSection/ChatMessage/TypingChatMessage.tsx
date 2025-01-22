import { Message } from "@/types";
import Typewriter from "typewriter-effect";

const TypingChatMessage = ({
  message,
  isAssistant = true,
}: {
  message: Message;
  isAssistant?: boolean;
}) => {
  // Only show typing effect for assistant messages
  const shouldShowTyping = isAssistant && message.isTyping;
  
  return (
    <div className="flex m-auto text-base py-2">
      {shouldShowTyping ? (
        <Typewriter
          options={{
            strings: [message.content],
            autoStart: true,
            delay: 30, // Adjust typing speed (milliseconds)
            cursor: "", // Hide cursor
            deleteSpeed: 9999999, // Prevent deletion
          }}
        />
      ) : (
        <p className="text-base leading-6 font-normal text-[rgb(13,13,13)]">
          {message.content}
        </p>
      )}
    </div>
  );
};

export default TypingChatMessage;
