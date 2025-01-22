import { Message } from "@/types";
import Typewriter from "typewriter-effect";

const TypingChatMessage = ({
  message,
  isAssistant = true,
}: {
  message: Message;
  isAssistant?: boolean;
}) => {
  const shouldShowTyping = isAssistant && message.isTyping;

  return (
    <div className="flex m-auto text-base py-2">
      {shouldShowTyping ? (
        <Typewriter
          options={{
            strings: [message.content],
            autoStart: true,
            delay: 30,
            cursor: "",
            deleteSpeed: 9999999,
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
