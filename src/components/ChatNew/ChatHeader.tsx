import { ChatState } from "@/types";
import { useMediaQuery, useTheme } from "@mui/material";
import { MessageCirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatControl from "../ui/chat-control";
interface ChatHeaderProps {

  setOpen: (leftside: boolean) => void;
  setOpenRight: (side: boolean) => void;
  createNewChat: (chat: string) => void;
  state: ChatState;
}

export default function ChatHeader({
  open,
  setOpen,
 
  createNewChat,
  state,
}: ChatHeaderProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
 
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleCreateChat = () => {
    createNewChat();
    navigate("/chat");
  };

  return (
    <>
      {state.s3Key && (
        <div className="flex items-center gap-2">
          {/* <div className="flex" onClick={handleChatControl}>
            <ChatControl />
          </div> */}
          <div className="flex" onClick={handleCreateChat}>
            <MessageCirclePlus className="cursor-pointer w-8 h-8 text-black ml-4" />
          </div>
        </div>
      )}
    </>
  );
}
