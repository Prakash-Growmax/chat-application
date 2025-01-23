import ChatBox from "@/components/ChatNew/ChatBox";
import { ChatInput } from "@/components/ChatNew/ChatInput";
import ChatStarterText from "@/components/layout/ChatSection/ChatStarterText";
import { useChatContext } from "@/context/ChatContext";
import { useEffect } from "react";

function NewChat() {
  const { queue, emptyQueue } = useChatContext();

  useEffect(() => {
    emptyQueue();
  }, []);
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col w-full">
      {queue?.length > 0 && <ChatBox isNewChat={true} />}
      <div
        className={`${
          queue?.length ? "" : "flex-1 pb-24"
        } flex flex-col items-center justify-center w-full  py-4`}
      >
        {queue?.length === 0 && <ChatStarterText />}
        <ChatInput isNewChat={true} />
      </div>

      <div className="px-2 pb-2 text-center">
        <div className="text-xs text-gray-500">
          Ansight can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
}

export default NewChat;
