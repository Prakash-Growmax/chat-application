import Typewriter from "typewriter-effect";

const GreetingResponse = ({ message, isTyping, isAssistant }) => {
  const showTyping = isAssistant && isTyping;

  return (
    <>
      {showTyping ? (
        <Typewriter
          options={{
            strings: [String(message)],
            autoStart: true,
            delay: 30,
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
