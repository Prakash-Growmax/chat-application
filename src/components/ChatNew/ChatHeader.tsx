import { ChatState } from "@/types";
import { useNavigate } from "react-router-dom";
import LucideIcon from "../Custom-UI/LucideIcon";
interface ChatHeaderProps {
  setOpen: (leftside: boolean) => void;
  setOpenRight: (side: boolean) => void;
  createNewChat: (chat: string) => void;
  state: ChatState;
}

export default function ChatHeader({

  createNewChat,
  state,
}: ChatHeaderProps) {
  const navigate = useNavigate();
  const handleCreateChat = () => {
    createNewChat();
    navigate("/chat");
  };

  return (
    <>
      {state.s3Key && (
        <div className="flex items-center gap-2">
          <div className="flex" onClick={handleCreateChat}>
            <LucideIcon
              name={"MessageCirclePlus"}
              className="cursor-pointer w-8 h-8 text-black ml-4"
            />
          </div>
        </div>
      )}
    </>
  );
}
