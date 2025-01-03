import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { useChatList } from "@/hooks/useChatList";
import ChatMsg from "../ui/chat-message";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export default function MyRecent({isDropdownOpen,setDropdownOpen}) {
 
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const { data } = useChatList();

  return (
    <>
      <div className="relative">
        {/* Toggle Dropdown */}
        <div className="flex gap-1">
          <ChatMsg />
          <p
            className="flex text-sm font-medium ml-4 cursor-pointer"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            My Thread
          </p>
          <KeyboardArrowDownIcon onClick={() => setDropdownOpen(!isDropdownOpen)} />
        </div>

        {/* Dropdown Content */}
        {isDropdownOpen && (
          <div
            className="absolute z-10 bg-transparent mt-2 w-56 max-h-40 overflow-y-auto"
            style={{ top: "100%", left: "0" }}
          >
            {data.map((chat, index) => (
              <div key={index} className="relative mb-2">
                <div
                  className={`flex items-center justify-between px-2 py-1 rounded-lg ${
                    index === 0 || hoveredIndex === index ? "bg-gray-200" : ""
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      navigate(`/chat/${chat.chat_id}`);
                      setDropdownOpen(false); // Close dropdown on selection
                    }}
                  >
                    <p className="text-xs text-gray-700 truncate px-2">
                      {chat.last_message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

  
    </>
  );
}
