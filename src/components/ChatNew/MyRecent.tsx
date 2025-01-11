import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

import { useChatList } from "@/hooks/useChatList";
import { ListItemText } from "@/Theme/Typography";
import {
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  MessageSquareMore,
} from "lucide-react";
import DeleteIcon from "../ui/delete-icon";

export default function MyRecent({
  isDropdownOpen,
  setDropdownOpen,
  isMobile,
}) {
  const { open, setOpen } = useContext(AppContext);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const navigate = useNavigate();
  const { data } = useChatList();
  const [activeDropdownIndex, setActiveDropdownIndex] = React.useState();
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  React.useEffect(() => {
    const handleClickOutside = (event: any) => {
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

  const toggleDropdown = (index: number, e: any) => {
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
    <div className="relative cursor-pointer">
      <div
        className="flex items-center justify-between rounded-lg hover:bg-gray-200 cursor-pointer py-1"
        onClick={() => {
          setDropdownOpen(!isDropdownOpen);
        }}
      >
        <div className="flex items-center gap-3">
          <MessageSquareMore size={12} color="#64748B" />
          <ListItemText
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!isDropdownOpen);
            }}
          >
            My Threads
          </ListItemText>
        </div>
        <div>
          {isDropdownOpen ? (
            <ChevronDown size={12} />
          ) : (
            <ChevronRight size={12} />
          )}
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="absolute z-10 bg-transparent lg:w-44 md:w-full w-56 max-h-40 overflow-y-auto"
          style={{ paddingLeft: "4.8px", paddingRight: "4.8px" }}
        >
          {data.map((chat, index) => (
            <div key={index} className="relative my-2 lg:ml-0 ml-8">
              <div
                className={`flex items-center rounded-lg px-2 py-1 ${
                  hoveredIndex === index ? "bg-gray-200" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(0)}
              >
                <div className="flex justify-between w-full items-center">
                  <ListItemText
                    className="leading-4 truncate "
                    onClick={() => {
                      navigate(`/chat/${chat.chat_id}`);
                      if (isMobile) {
                        setOpen(false);
                      }
                    }}
                  >
                    {chat.last_message}
                  </ListItemText>

                  {hoveredIndex === index && (
                    <button onClick={(e) => toggleDropdown(index, e)}>
                      <EllipsisVertical size={12} className="m-1" />
                    </button>
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
              <button className="flex gap-3 w-full text-left px-2 py-2 hover:bg-gray-100 text-red-600">
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
