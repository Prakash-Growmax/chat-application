import { useEffect } from "react";
import TypingChatInsights from "./TypingChatInsights";

const InsighttResponse = ({ data }) => {
  useEffect(() => {
    const timer = setTimeout(() => {}, data.length * 30 + 500);

    return () => clearTimeout(timer);
  }, [data]);

  return (
    <TypingChatInsights
      data={data} // Pass the value for the corresponding key
      isAssistant={true}
      isTyping={true}
    />
  );
};

export default InsighttResponse;
