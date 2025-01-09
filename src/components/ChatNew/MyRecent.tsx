import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import BellowArrow from "../ui/bellow-arrow";
import ChatMsg from "../ui/chat-message";
import DeleteIcon from "../ui/delete-icon";
import OptionIcon from "../ui/option-icon";
import RightArrow from "../ui/right-arrow";
import TooltipNew from "../ui/tooltipnew";
import { styled } from "@mui/system";
import { useChatList } from "@/hooks/useChatList";



export default function MyRecent({isDropdownOpen,setDropdownOpen,isMobile,isTab}) {
   const {open,setOpen}=useContext(AppContext);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const navigate = useNavigate();
  const { data } = useChatList();
  const [activeDropdownIndex, setActiveDropdownIndex] = React.useState(null);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeDropdownIndex !== null &&
        !event.target.closest(".dropdown-container")
      ) {
        setActiveDropdownIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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
      left: rect.left,
    });

    setActiveDropdownIndex(index);
  };

  return (
    <div className="relative">
    <TooltipNew title={isDropdownOpen ? "Close My Thread":"Expand My Thread"} placement="top-start">
      <div
        className="flex items-center justify-between rounded-lg hover:bg-gray-200 cursor-pointer px-4 py-2"
        onClick={() => {
          setDropdownOpen(!isDropdownOpen);
        }}
      >
        <div className="flex items-center gap-3">
          <ChatMsg />
          <p
            className="font-inter text-slate-500 lg:text-[15px] md:text-[18px] text-[18px] leading-4"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!isDropdownOpen);
            }}
          >
            My Thread
          </p>
        </div>
        <div>
          {isDropdownOpen ? <BellowArrow /> : <RightArrow />}
        </div>
      </div>
    </TooltipNew>

    {isDropdownOpen && (
      <div
        className="absolute z-10 bg-transparent lg:w-44 md:w-full w-56 max-h-40 overflow-y-auto"
        style={{ paddingLeft:"4.8px", paddingRight:"4.8px"}}
      >
        {data.map((chat, index) => (
          <div key={index} className="relative my-2 lg:ml-0 ml-8">
            <div
              className={`flex items-center rounded-lg px-4 py-1 ${
                hoveredIndex === index ? "bg-gray-200" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(0)}
            >
              <div className="flex justify-between w-full items-center">
                <p
                  className="font-inter text-gray-600 lg:text-[13px] md:text-[15px] text-[15px] text-[#64748B] leading-4 truncate md:max-w-[calc(100%-40px)] lg:max-w-[150px]"
                  onClick={() => {
                    navigate(`/chat/${chat.chat_id}`);
                    if(isMobile){
                      setOpen(false)
                    }
                  }}
                >
                  {chat.last_message}
                </p>

                {hoveredIndex === index && (
                  <div className="dropdown-container">
                    <TooltipNew title="Options" placement="top-start">
                      <button
                        onClick={(e) => toggleDropdown(index, e)}
                        className="text-sm text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-300"
                      >
                        <OptionIcon />
                      </button>
                    </TooltipNew>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {activeDropdownIndex !== null && (
      <div
        className="options-menu fixed bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-44"
        style={{
          top: `${optionsPosition.top}px`,
          left: `${optionsPosition.left}px`,
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
