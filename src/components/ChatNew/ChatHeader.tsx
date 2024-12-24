import { MessageCirclePlus, MenuIcon } from "lucide-react";
import ChatControl from "../ui/chat-control";
import { IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useNavigate } from "react-router-dom";
import { ChatState } from "@/types";
interface ChatHeaderProps {
    openRight: boolean;
    open:boolean;
    setOpen:(leftside:boolean)=>void;
    setOpenRight: (side: boolean) => void;
    createNewChat: (chat: string) => void;
     state: ChatState;
   
  }

export default function ChatHeader({open,setOpen,openRight,setOpenRight,createNewChat,state}:ChatHeaderProps){
    console.log(state)
    const navigate = useNavigate();
    const handleChatControl=()=>{
        setOpenRight(!openRight)
       }
       const handleDrawerOpen=()=>{
         setOpen(true)
       }
       const handleDrawerClose=()=>{
        setOpen(false)
       }
       const handleCreateChat = () =>{
         createNewChat();
         navigate("/chat");
       }
     
    return(
        <>
<div className="w-full">
 <IconButton
          size="large"
          edge="start"
          aria-label="menu"
          onClick={handleDrawerOpen}
          disableFocusRipple // Removes focus ripple
          sx={{
            mr: 2,
            color: 'black',
            '&:focus': { outline: 'none' }, // Removes focus outline
            '&:active': { outline: 'none' }, // Removes outline on click
          }}
          >
  <MenuIcon style={{ color: 'black' }} /> {/* Ensures the MenuIcon is white */}
</IconButton>
</div>
{state.s3Key && (<div className="flex items-center gap-2">
<div className='flex' onClick={handleChatControl}>
      <ChatControl/>
      </div>
      <div className='flex' onClick={handleCreateChat}>
      <MessageCirclePlus
      className="cursor-pointer w-8 h-8 text-black ml-4"
    
    />
      </div>


  </div>)}

        </>
 
    )
}