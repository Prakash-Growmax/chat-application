import { useProfile } from "@/hooks/profile/useProfile";
import { useChatList } from "@/hooks/useChatList";
import { chatService } from "@/services/ChatService";
import { ListItemText } from "@/Theme/Typography";
import { getAccessToken } from "@/utils/storage.utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import LucideIcon from "../Custom-UI/LucideIcon";
import DeleteIcon from "../ui/delete-icon";
import Spinner from "../ui/Spinner";

export default function MyRecent({
  isDropdownOpen,
  setDropdownOpen,
  isMobile,
  isTab,
  setRecentData,
}) {
  const { setSideDrawerOpen } = useContext(AppContext);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Tracks the currently hovered index
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  const [sessionList, setSessionList] = useState([]);
  const { profile } = useProfile();
  const navigate = useNavigate();
  useChatList(setSessionList);

  async function sessionDelete(sessionId) {
    if (profile?.organization_id) {
      const token = getAccessToken();
      const headers = {
        "Content-Type": "application/json",
        "x-organization-id": profile.organization_id,
        Authorization: `Bearer ${token}`,
      };

      const response = await chatService.deleteSession(sessionId, { headers });

      if (response.status === 200) {
        const updatedSessionList = {
          ...sessionList,
          data: sessionList?.data?.filter(
            (session) => session.id !== sessionId
          ),
        };
        setSessionList(updatedSessionList);
      }
      return response;
    }
  }

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
  const listVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1, // Staggered animation
        duration: 0.3,
      },
    }),
    exit: { opacity: 0, x: -20 },
  };
  useEffect(() => {
    if (sessionList?.data) {
      setRecentData(false);
    }
  }, [sessionList?.data]);
  return (
    <div className="relative cursor-pointer">
      <div
        className="flex items-center justify-between rounded-lg hover:bg-gray-200 cursor-pointer p-1"
        onClick={() => {
          setDropdownOpen(!isDropdownOpen);
        }}
      >
        <div className="flex items-center gap-3">
          <LucideIcon name={"MessageSquareMore"} size={12} color="#64748B" />
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
            <LucideIcon name={"ChevronDown"} size={12} />
          ) : (
            <LucideIcon name={"ChevronDown"} size={12} />
          )}
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="absolute z-10 bg-transparent w-full max-h-40 overflow-y-auto"
          style={{ paddingLeft: "4.8px", paddingRight: "4.8px" }}
        >
          <AnimatePresence>
            {sessionList?.data ? (
              sessionList.data.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={listVariants}
                  className="relative my-2 ml-4"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className={`flex items-center rounded-lg px-2 py-1 w-full transition-colors duration-200 ${
                      hoveredIndex === index ||
                      index === 0 ||
                      activeDropdownIndex === index
                        ? "bg-gray-200"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between w-full items-center">
                      <ListItemText
                        className="leading-4 truncate"
                        onClick={() => {
                          navigate(`/chat/${chat.id}`);
                          if (isMobile || isTab) {
                            setSideDrawerOpen(false);
                          }
                        }}
                      >
                        {chat.name}
                      </ListItemText>

                      {(hoveredIndex === index ||
                        activeDropdownIndex === index) && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={(e) => toggleDropdown(index, e)}
                        >
                          <LucideIcon
                            name="EllipsisVertical"
                            size={12}
                            className="m-1"
                          />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="relative my-2 lg:ml-24 ml-16 mt-4">
                <div
                  role="status"
                  className="space-y-2.5 animate-pulse max-w-lg"
                >
                  <Spinner />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {activeDropdownIndex !== null && activeDropdownIndex !== undefined && (
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
              <button
                className="flex gap-3 w-full text-left px-2 py-2 hover:bg-gray-100 text-red-600"
                onClick={async () => {
                  setHoveredIndex(null);
                  setActiveDropdownIndex(null);
                  await sessionDelete(
                    sessionList?.data[activeDropdownIndex]?.id
                  );
                }}
              >
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
