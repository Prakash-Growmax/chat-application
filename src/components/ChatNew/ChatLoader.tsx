import { useChatContext } from "@/context/ChatContext";
import PaperCard from "../Custom-UI/PaperCard";
import ChatAssistantHeader from "./ChatMessage/ChatAssistantHeader";

function ChatLoader() {
  const { processing } = useChatContext();
  return (
    processing && (
      <PaperCard className="mt-4 mb-4">
        <ChatAssistantHeader />

        {/* Enhanced Loading Animation */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex gap-2">
            <div className="h-2 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse"></div>
            <div className="h-2 w-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="h-2 w-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            <div className="h-2 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.6s]"></div>
            <div className="h-2 w-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.8s]"></div>
            <div className="h-2 w-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.9s]"></div>
          </div>

          <div className="flex gap-2">
            <div className="h-2 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.1s]"></div>
            <div className="h-2 w-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="h-2 w-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.3s]"></div>
            <div className="h-2 w-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>

          <div className="flex gap-2">
            <div className="h-2 w-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="h-2 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            <div className="h-2 w-28 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.6s]"></div>
          </div>
        </div>
      </PaperCard>
    )
  );
}

export default ChatLoader;
