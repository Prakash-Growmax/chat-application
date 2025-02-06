import React, { useEffect } from "react";
import Typewriter from "typewriter-effect";

const GreetingResponse = ({ message, isTyping, isAssistant, onContentType }) => {
  const showTyping = isAssistant && isTyping;

  useEffect(() => {
    // Notify parent whenever `showTyping` changes
    onContentType?.(showTyping);
  }, [showTyping, onContentType]);

  return (
    <>
      {showTyping ? (
        <Typewriter
          options={{
            strings: [String(message)],
            autoStart: true,
            delay:2,
            cursor: "",
            deleteSpeed: 9999999,
          }}
        />
      ) : (
        <span>{message}</span>
      )}
    </>
  );
};

export default GreetingResponse;

