import Chat from "@/components/ChatNew/Chat";
import { useGetChatHistory } from "@/hooks/useGetChatHistory";
import { useParams } from "react-router-dom";

function ChatSection() {
  const { id } = useParams();
  const { data } = useGetChatHistory(id);
  return <Chat message={data} />;
}

export default ChatSection;
