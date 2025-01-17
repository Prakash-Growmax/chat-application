import Chat from "@/components/ChatNew/Chat";
import { useGetChatHistory } from "@/hooks/useGetChatHistory";
import { useParams } from "react-router-dom";

function ChatSection() {
  const { id } = useParams();
  console.log("🚀 ~ ChatSection ~ id:", id);
  const { data } = useGetChatHistory(id);
  console.log("🚀 ~ ChatSection ~ data:", data);
  return <Chat message={data} />;
}

export default ChatSection;
