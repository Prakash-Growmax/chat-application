import { ChatState } from "@/types";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";
import { MenuIcon, MessageCirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatControl from "../ui/chat-control";
interface ChatHeaderProps {
  openRight: boolean;
  open: boolean;
  setOpen: (leftside: boolean) => void;
  setOpenRight: (side: boolean) => void;
  createNewChat: (chat: string) => void;
  state: ChatState;
}

export default function ChatHeader({
  open,
  setOpen,
  openRight,
  setOpenRight,
  createNewChat,
  state,
}: ChatHeaderProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleChatControl = () => {
    setOpenRight(!openRight);
  };
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
    {!isMobile && (  <div className="w-full">
        <IconButton
          size="large"
          edge="start"
          aria-label="menu"
          onClick={handleDrawerOpen}
          disableFocusRipple // Removes focus ripple
          sx={{
            mr: 2,
            color: "black",
            "&:focus": { outline: "none" }, // Removes focus outline
            "&:active": { outline: "none" }, // Removes outline on click
          }}
        >
          <MenuIcon style={{ color: "black" }} />{" "}
          {/* Ensures the MenuIcon is white */}
        </IconButton>
      </div>)}
    
      {state.s3Key && (
        <div className="flex items-center gap-2">
          <div className="flex" onClick={handleChatControl}>
            <ChatControl />
          </div>
          <div className="flex" onClick={handleCreateChat}>
            <MessageCirclePlus className="cursor-pointer w-8 h-8 text-black ml-4" />
          </div>
        </div>
      )}
    </>
  );
}
