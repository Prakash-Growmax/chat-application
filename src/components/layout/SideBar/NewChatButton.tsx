import AppContext from "@/components/context/AppContext";
import ChatEdit from "@/components/ui/chat-edit";
import { useMediaQuery, useTheme } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus } from 'lucide-react';
function NewChatButton({isMobile}) {
  const navigate = useNavigate();
  const {open,setOpen}=useContext(AppContext);
  return (
    <div className="flex items-center justify-center">
      <button
        className="group bg-white w-full py-2 px-1 border border-gray-200 rounded-md text-sm flex items-center justify-center hover:border-gray-300 hover:shadow-md transition duration-200 ease-in-out"
        onClick={() => {
          navigate("/chat");
          if(isMobile){
            setOpen(false);
          }
          localStorage.removeItem('chatId');

        }}
      >
        <span className="flex items-center gap-2">
          <MessageSquarePlus size={20}/>
          {/* <ChatEdit className="text-black" /> */}
          <span className="lg:text-xs md:text-base text-black text-base">New Thread</span>
        </span>
      </button>
    </div>
  );
}

export default NewChatButton;
