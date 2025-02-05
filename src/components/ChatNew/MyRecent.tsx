import { useChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { chatService } from "@/services/ChatService";
import { ListItemText } from "@/Theme/Typography";
import { getAccessToken } from "@/utils/storage.utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import LucideIcon from "../Custom-UI/LucideIcon";
import DeleteIcon from "../ui/delete-icon";
import Spinner from "../ui/Spinner";

// Query key factory
const queryKeys = {
  sessions: (orgId: string) => ["sessions", orgId],
};

// API functions
const fetchSessions = async (orgId: string) => {
  if (!orgId) throw new Error("Organization ID is required");

  const token = getAccessToken();
  const response = await chatService.getSession({
    headers: {
      "Content-Type": "application/json",
      "x-organization-id": orgId,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response?.status !== 200) {
    throw new Error("Error while fetching sessions");
  }

  return response;
};

const deleteSession = async ({
  sessionId,
  orgId,
}: {
  sessionId: string;
  orgId: string;
}) => {
  const token = getAccessToken();
  const response = await chatService.deleteSession(sessionId, {
    headers: {
      "Content-Type": "application/json",
      "x-organization-id": orgId,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Error while deleting session");
  }

  return response;
};

export default function MyRecent({
  isDropdownOpen,
  setDropdownOpen,
  isMobile,
  isTab,
  setRecentData,
}: {
  isDropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  isTab: boolean;
  setRecentData: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { profile } = useProfile();
  const { setSideDrawerOpen } = useContext(AppContext);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(
    null
  );
  const [optionsPosition, setOptionsPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const navigate = useNavigate();
  const { emptyQueue } = useChatContext();
  const queryClient = useQueryClient();

  // Query hook for fetching sessions
  const { data: sessionList, isLoading } = useQuery({
    queryKey: queryKeys.sessions(profile?.organization_id),
    queryFn: () => fetchSessions(profile?.organization_id),
    enabled: !!profile?.organization_id,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep data in cache for 30 minutes
  });

  // Mutation hook for deleting sessions
  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: (_, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.sessions(profile?.organization_id),
        (old) => ({
          ...old,
          data: old.data.filter(
            (session) => session.id !== variables.sessionId
          ),
        })
      );
    },
  });

  React.useEffect(() => {
    const handleClickOutside = (event: React.MouseEvent) => {
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

  const toggleDropdown = (index: number, e: React.MouseEvent) => {
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
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.3,
      },
    }),
    exit: { opacity: 0, x: -20 },
  };

  React.useEffect(() => {
    if (sessionList?.data) {
      setRecentData(false);
    }
  }, [sessionList?.data]);

  const handleDelete = async (sessionId: string) => {
    setHoveredIndex(null);
    setActiveDropdownIndex(null);
    await deleteMutation.mutateAsync({
      sessionId,
      orgId: profile?.organization_id,
    });
  };

  return (
    <div className="relative cursor-pointer">
      <div
        className="flex items-center justify-between rounded-lg hover:bg-gray-200 cursor-pointer p-1"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-3">
          <LucideIcon name="MessageSquareMore" size={12} color="#64748B" />
          <ListItemText>My Threads</ListItemText>
        </div>
        <div>
          <LucideIcon name="ChevronDown" size={12} />
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="absolute z-10 bg-transparent w-full max-h-40 overflow-y-auto"
          style={{ paddingLeft: "4.8px", paddingRight: "4.8px" }}
        >
          <AnimatePresence>
            {isLoading ? (
              <div className="relative my-2 lg:ml-24 ml-16 mt-4">
                <div
                  role="status"
                  className="space-y-2.5 animate-pulse max-w-lg"
                >
                  <Spinner />
                </div>
              </div>
            ) : (
              sessionList?.data?.map((chat, index) => (
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
                      <div
                        onClick={() => {
                          setPrevMessage([]);
                          emptyQueue();

                          handleClickRoute(chat.id);
                        }}
                      >
                        <ListItemText className="leading-4 truncate">
                          {chat.name}
                        </ListItemText>
                      </div>

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
                onClick={() =>
                  handleDelete(sessionList?.data[activeDropdownIndex]?.id)
                }
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
