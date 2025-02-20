import ChatBox from "@/components/ChatNew/ChatBox";
import { ChatInput } from "@/components/ChatNew/ChatInput";
import ChatStarterText from "@/components/layout/ChatSection/ChatStarterText";
import { useChatContext } from "@/context/ChatContext";
import { useEffect } from "react";
import { TriangleAlert } from 'lucide-react';
import { useProfile } from "@/hooks/profile/useProfile";
function NewChat() {
  const { queue, emptyQueue,setPrevMessage,setS3Key } = useChatContext();
   const { profile } = useProfile();
  useEffect(() => {
    emptyQueue();
    setS3Key("")
    setPrevMessage([]);

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
        {queue?.length === 0 && (profile?.tokens_remaining === 0 || profile?.tokens_remaining === null) && ( <div className="px-4">
        <div className="flex max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-lg p-2  flex items-center gap-2 mt-2">
   <TriangleAlert size={24} color="red"/>
   <p className="text-xs">You've reached the maximum usage for your current plan. Please upgrade to continue exploring more features</p>
</div>
        </div>)}
       
   
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
