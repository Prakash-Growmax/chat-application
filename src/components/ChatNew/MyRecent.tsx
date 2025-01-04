import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { useChatList } from "@/hooks/useChatList";
import ChatMsg from "../ui/chat-message";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OptionIcon from "../ui/option-icon";
import ShareIcon from "../ui/share-icon";
import RenameIcon from "../ui/rename-icon";
import ArchiveIcon from "../ui/archive-icon";
import DeleteIcon from "../ui/delete-icon";

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
  const [activeDropdownIndex, setActiveDropdownIndex] = React.useState(null);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdownIndex !== null && !event.target.closest('.dropdown-container')) {
        setActiveDropdownIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdownIndex]);

  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    
    if (activeDropdownIndex === index) {
      setActiveDropdownIndex(null);
      return;
    }

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    setOptionsPosition({
      top: rect.bottom + scrollTop,
      left: rect.left
    });
    
    setActiveDropdownIndex(index);
  };
  return (
    <div className="relative">
      {/* Main Thread Button */}
      <div className="flex gap-1 px-2 py-2 rounded-lg hover:bg-gray-200 cursor-pointer">
        <ChatMsg />
        <p
          className="flex text-sm font-medium ml-4 cursor-pointer"
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        >
          My Thread
        </p>
        <KeyboardArrowDownIcon 
          className="cursor-pointer"
          onClick={() => setDropdownOpen(!isDropdownOpen)} 
        />
      </div>

      {/* Thread Dropdown */}
      {isDropdownOpen && (
        <div className="absolute z-10 bg-transparent  mt-2 w-56 max-h-40 overflow-y-auto">
          {data.map((chat, index) => (
            <div 
              key={index} 
              className="relative mb-2"
            >
              <div
                className={`flex items-center justify-between px-2 py-1 rounded-lg ${
                  hoveredIndex === index ? "bg-gray-200" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    navigate(`/chat/${chat.chat_id}`);
                    setDropdownOpen(false);
                  }}
                >
                  <p className="text-xs text-gray-700 truncate px-2" style={{ width: "150px" }}>
                    {chat.last_message}
                  </p>
                </div>
                {(hoveredIndex === index || index === 0) && (
                  <div className="dropdown-container">
                    <button
                      onClick={(e) => toggleDropdown(index, e)}
                      className="ml-2 p-1 text-sm text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-300"
                    >
                      <OptionIcon />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Options Menu - Positioned fixed relative to viewport */}
      {activeDropdownIndex !== null && (
        <div
          className="options-menu fixed bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-44"
          style={{
            top: `${optionsPosition.top}px`,
            left: `${optionsPosition.left}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <button className="flex gap-3 w-full text-left px-4 py-2 hover:bg-gray-100">
                <ShareIcon />
                Share
              </button>
            </li>
            <li>
              <button className="flex gap-3 w-full text-left px-4 py-2 hover:bg-gray-100">
                <RenameIcon />
                Rename
              </button>
            </li>
            <li>
              <button className="flex gap-3 w-full text-left px-4 py-2 hover:bg-gray-100">
                <ArchiveIcon />
                Archive
              </button>
            </li>
            <li>
              <button className="flex gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                <DeleteIcon />
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
