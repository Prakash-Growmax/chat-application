import { useChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { chatService } from "@/services/ChatService";
import { ListItemText } from "@/Theme/Typography";
import { getAccessToken } from "@/utils/storage.utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { subDays } from "date-fns";
import AppContext from "../context/AppContext";
import LucideIcon from "../Custom-UI/LucideIcon";
import DeleteIcon from "../ui/delete-icon";
import Spinner from "../ui/Spinner";
import { FilePenLine } from 'lucide-react';
import { Input } from "../ui/input";

// Utility function for safe date handling
const getSafeDate = (dateString: string | number | Date | null | undefined): Date => {
  if (!dateString) return new Date();
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

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

interface ChatItemProps {
  chat: any;
  index: number;
  isActive: boolean;
  isHovered: boolean;
  hoveredIndex: number;
  isDeleting: boolean;
  deleteIndex: number;
  activeDropdownIndex:number;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  onToggleDropdown: (e: React.MouseEvent) => void;
  renamingChatId: string;
  setRenamingChatId: (name: string) => void;
  onRename: (chatId: string, newName: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = React.memo(({
  chat,
  index,
  isActive,
  isHovered,
  hoveredIndex,
  isDeleting,
  deleteIndex,
  activeDropdownIndex,
  onHover,
  onLeave,
  onToggleDropdown,
  onClick,
  renamingChatId,
  setRenamingChatId,
  onRename,
}) => {

  const [tempName, setTempName] = useState(chat.name || "Untitled Chat");
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  const handleRenameSubmit = () => {
    if (tempName.trim() && tempName !== chat.name) {
      onRename(renamingChatId, tempName); 
    }
    setRenamingChatId(null);
  };
 
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -20 },
      }}
      className="relative dropdown-container hover:bg-gray-50"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className={`flex items-center rounded-lg px-1.5 py-1.5 w-[95%] transition-colors duration-200 hover:bg-gray-200 rounded-lg ${
          (isActive || hoveredIndex === index || activeDropdownIndex == index )  ? "bg-gray-200" : ""
        }`}
      >
        <div className="flex justify-between w-full items-center justify-center">
          <div onClick={onClick} className="flex-1 min-w-0 cursor-pointer">
            <div className="flex flex-col">
              {renamingChatId === chat?.id ? (
                <Input
                  type="text"
                  value={tempName}
                  onChange={handleNameChange}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
                  autoFocus
                  placeholder="Rename"
                />
              ) : (
                <ListItemText className="leading-5 truncate">
                  {chat.name || "Untitled Chat"}
                </ListItemText>
              )}
            </div>
          </div>
          {Boolean(deleteIndex === index) && isDeleting ? (
            <Spinner />
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              exit={{ opacity: 0 }}
              onClick={onToggleDropdown}
              className="p-1"
            >
              <LucideIcon name="EllipsisVertical" size={12} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

interface CategoryHeaderProps {
  title: string;
  count: number;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, count }) => (
  <div className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 ml-4">
    {title}
  </div>
);

interface MyRecentProps {
  isDropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  isTab: boolean;
  setRecentData: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MyRecent({
  isDropdownOpen,
  setDropdownOpen,
  isMobile,
  isTab,
  setRecentData,
}: MyRecentProps) {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);
  const { id } = useParams();
  const { profile } = useProfile();
  const { setSideDrawerOpen, historyList, setHistoryList } = useContext(AppContext);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  const [optionsPosition, setOptionsPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [deleteIndex, setDeleteIndex] = useState<number>(0);
  const navigate = useNavigate();
  const { emptyQueue, setPrevMessage } = useChatContext();
  const queryClient = useQueryClient();
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);

  const getCategorizedChats = useCallback((sessions: any[]) => {
    if (!sessions) return { today: [], last7Days: [], older: [] };

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    return sessions.reduce((acc: any, chat: any, index: number) => {
      const chatDate = getSafeDate(chat.created_at);
      const chatDateStart = new Date(chatDate);
      chatDateStart.setHours(0, 0, 0, 0); // Set to start of chat date

      if (chatDateStart.getTime() === today.getTime()) {
        acc.today.push({ chat, index });
      } else if (chatDateStart >= sevenDaysAgo && chatDateStart < today) {
        acc.last7Days.push({ chat, index });
      } else {
        acc.older.push({ chat, index });
      }
      return acc;
    }, {
      today: [],
      last7Days: [],
      older: [],
    });
  }, []);

  const { data: sessionList, isLoading } = useQuery({
    queryKey: queryKeys.sessions(profile?.organization_id),
    queryFn: () => fetchSessions(profile?.organization_id),
    enabled: !!profile?.organization_id,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (historyList && profile?.organization_id) {
      queryClient.invalidateQueries(queryKeys.sessions(profile.organization_id));
    }
  }, [historyList, profile?.organization_id, queryClient]);

  useEffect(() => {
    if (sessionList) {
      queryClient.invalidateQueries(queryKeys.sessions(profile.organization_id));
    }
  }, [sessionList]);

  const categorizedChats = React.useMemo(() =>
    getCategorizedChats(sessionList?.data || []),
    [sessionList?.data, getCategorizedChats]
  );

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        queryKeys.sessions(profile?.organization_id),
        (old: any) => ({
          ...old,
          data: old.data.filter(
            (session: any) => session.id !== variables.sessionId
          ),
        })
      );
      if (isMobile || isTab) {
        setSideDrawerOpen(false);
      }
      navigate("/chat/new");
      toast.success("Thread deleted successfully");
    },
  });

  const renameMutation = useMutation({
    mutationFn: async ({ chatId, newName }: { chatId: string; newName: string }) => {
      const token = getAccessToken();
      const requestBody = {
        new_name: newName,
      };
      const response = await chatService.renameSession(chatId, requestBody, {
        headers: {
          "Content-Type": "application/json",
          "x-organization-id": profile?.organization_id,
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        queryKeys.sessions(profile?.organization_id),
        (old: any) => ({
          ...old,
          data: old.data.map((session: any) =>
            session.id === variables.chatId
              ? { ...session, name: variables.newName }
              : session
          ),
        })
      );
      setRenamingChatId(null);
      toast.success("Chat renamed successfully");
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdownIndex !== null &&
        !(event.target as Element).closest(".dropdown-container")
      ) {
        setActiveDropdownIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdownIndex]);

  useEffect(() => {
    if (sessionList?.data) {
      setRecentData(false);
    }
  }, [sessionList?.data, setRecentData]);

  const handleClickRoute = useCallback((chatId: string) => {
    navigate(`/chat/${chatId}`);
    if (isMobile || isTab) {
      setSideDrawerOpen(false);
    }
  }, [navigate, isMobile, isTab, setSideDrawerOpen]);

  const toggleDropdown = useCallback((index: number, e: React.MouseEvent) => {
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
  }, [activeDropdownIndex]);

  const handleDelete = useCallback(async (sessionId: string, index: number) => {
    setDeleteIndex(index);
    setHoveredIndex(null);
    setIsDeleting(true);
    setActiveDropdownIndex(null);

    try {
      await deleteMutation.mutateAsync({
        sessionId,
        orgId: profile?.organization_id,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteMutation, profile?.organization_id]);

  const handleRename = (chatId: string, newName: string) => {
    if (newName.trim() && newName !== "") {
      renameMutation.mutate({ chatId, newName });
    }
  };

  const renderChatList = useCallback((chats: { chat: any; index: number }[], categoryTitle: string, renamingChatId: string, setRenamingChatId: (name: string) => void, handleRename: (sessionId: string, newName: string) => void) => {
    if (chats.length === 0) return null;

    return (
      <div className="mb-2">
        <CategoryHeader title={categoryTitle} count={chats.length} />
        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-1 ml-6">
            {chats.map(({ chat, index }) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                index={index}
                isActive={id === chat.id}
                isHovered={hoveredIndex === index}
                hoveredIndex={hoveredIndex}
                isDeleting={isDeleting}
                deleteIndex={deleteIndex}
                activeDropdownIndex={activeDropdownIndex}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
                onClick={() => handleClickRoute(chat.id)}
                onToggleDropdown={(e) => toggleDropdown(index, e)}
                renamingChatId={renamingChatId}
                setRenamingChatId={setRenamingChatId}
                onRename={handleRename}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }, [id, activeDropdownIndex, hoveredIndex, isDeleting, deleteIndex, setPrevMessage, emptyQueue, handleClickRoute, toggleDropdown]);

  return (
    <div className="relative">
      <div
        className="flex items-center justify-between rounded-lg hover:bg-gray-200 cursor-pointer p-2"
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center gap-3">
          <LucideIcon name="MessageSquareMore" size={15} color="#64748B" />
          <ListItemText>My Threads</ListItemText>
        </div>
        <div className="mr-3">
          <LucideIcon
            name="ChevronDown"
            size={13}
            style={{
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease-in-out',
            }}
          />
        </div>
      </div>

      {isDropdownOpen && (
        <div
          className="absolute z-10 w-full bg-transparent overflow-hidden"
          style={{
            maxHeight:isTab ? "1400px" :"530px",
            overflowY: 'auto',
          }}
        >
          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <Spinner />
              </div>
            ) : sessionList?.data?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No threads found
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {categorizedChats.today.length > 0 && (
                  renderChatList(categorizedChats.today, "Today", renamingChatId, setRenamingChatId, handleRename)
                )}
                {categorizedChats.last7Days.length > 0 && (
                  renderChatList(categorizedChats.last7Days, "Last 7 Days", renamingChatId, setRenamingChatId, handleRename)
                )}
                {categorizedChats.older.length > 0 && (
                  renderChatList(categorizedChats.older, "Older", renamingChatId, setRenamingChatId, handleRename)
                )}
              </div>
            )}
          </AnimatePresence>
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
          <ul className="py-1">
          <li>
              <button
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-black hover:bg-gray-50"
                onClick={()=>{ 
                  const sessionId= sessionList?.data[activeDropdownIndex]?.id;
                  setRenamingChatId(sessionId)
                  setActiveDropdownIndex(null)}}
              >
                <FilePenLine size={18}/>
                Rename
              </button>
            </li>
            <li>
              <button
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                onClick={() =>
                  handleDelete(
                    sessionList?.data[activeDropdownIndex]?.id,
                    activeDropdownIndex
                  )
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