import Chat from "@/components/ChatNew/Chat";
import { drawerWidth } from "@/constants/general.constant";
import { useGetChatHistory } from "@/hooks/useGetChatHistory";
import { useParams } from "react-router-dom";

function ChatSection() {
  const { id } = useParams();
  const { data } = useGetChatHistory(id);
  console.log("🚀 ~ ChatSection ~ data:", data);
  return (
    <div className={`ml-[${drawerWidth}px] mt-16`}>
      <Chat message={data} />
    </div>
  );
}

export default ChatSection;
