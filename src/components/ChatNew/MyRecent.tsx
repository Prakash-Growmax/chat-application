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
import RightArrow from "../ui/right-arrow";
import BellowArrow from "../ui/bellow-arrow";
import TooltipNew from "../ui/tooltipnew";

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
      <div className="flex rounded-lg hover:bg-gray-200 cursor-pointer justify-between" style={{padding:"4.8px"}}>
        <div className="flex gap-3">
        <ChatMsg />
      
          <p className="font-inter text-slate-500 text-[11px] leading-[16px]"onClick={() => setDropdownOpen(!isDropdownOpen)}> My Thread</p>

         
        
        </div>
     
        <div>
          
          {isDropdownOpen ? (
            <TooltipNew title="Close My Thread" placement="top-start">
               <div onClick={()=>{setDropdownOpen(false)}}>
           <BellowArrow/>
          </div>
            </TooltipNew>
           ) : (
            <TooltipNew title="Exapand My Thread" placement="top-start">
            <div onClick={()=>{setDropdownOpen(true)}}>
            <RightArrow/>
            </div>
            </TooltipNew>
          )}
          
         
        
        </div>
       
      </div>

      {/* Thread Dropdown */}
      {isDropdownOpen && (
  <div className="absolute z-10 bg-transparent mt-2 w-44 max-h-40 overflow-y-auto"  style={{padding:"4.8px"}}>
    {data.map((chat, index) => (
      <div key={index} className="relative">
        <div
          className={`flex items-center rounded-lg px-3 ${
            hoveredIndex === index ? "bg-gray-200" : ""
          }`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Chat Message */}
          <div
            className="flex"
            onClick={() => {
              navigate(`/chat/${chat.chat_id}`);
              setDropdownOpen(false);
            }}
          >
            <p
              className="font-inter text-gray-600 text-xs leading-4 cursor-pointer truncate"
              style={{ width: "150px" }}
            >
              {chat.last_message}
            </p>
          </div>

          {/* Option Icon */}
          <div className="dropdown-container mt-1">
            <TooltipNew title="Options" placement="top-start">
            <button
              onClick={(e) => toggleDropdown(index, e)}
              className={`text-sm text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-300 ${
                hoveredIndex === index || index === 0
                  ? "visible"
                  : "invisible"
              }`}
            >
              <OptionIcon />
            </button>
            </TooltipNew>
         
          </div>
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
