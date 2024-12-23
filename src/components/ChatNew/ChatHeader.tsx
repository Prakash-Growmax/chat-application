import { MessageCirclePlus } from "lucide-react";
import ChatControl from "../ui/chat-control";
interface ChatHeaderProps {
    openRight: boolean;
    setOpenRight: (side: boolean) => void;
    createNewChat: (chat: string) => void;
  }

export default function ChatHeader({openRight,setOpenRight,createNewChat}:ChatHeaderProps){
    const handleChatControl=()=>{
        setOpenRight(!openRight)
       }
    return(
        <div className="bg-[#F6F8FA]">
    <div className="flex items-center gap-2">
    <div className='flex' onClick={handleChatControl}>
            <ChatControl/>
            </div>
            <div className='flex' onClick={createNewChat}>
            <MessageCirclePlus
            className="cursor-pointer w-8 h-8 text-black ml-4"
          
          />
            </div>
      
      </div> 
        </div>
    )
}