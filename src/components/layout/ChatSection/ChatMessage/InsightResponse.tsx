import { Message } from "@/types";
import { useEffect, useState } from "react";
import TypingChatInsights from "./TypingChatInsights";


const InsighttResponse = ({data}) => {
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, data.length * 30 + 500);

    return () => clearTimeout(timer);
  }, [data]);

  return(
    <div>
    
  <TypingChatInsights
    data={data} // Pass the value for the corresponding key
    isAssistant={true}
    isTyping={true}
  />

    </div>
  )
};

export default InsighttResponse;