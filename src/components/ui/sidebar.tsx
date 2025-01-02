import { useChatList } from "@/hooks/useChatList";
import { cn } from "@/lib/utils";
import AppsIcon from "@mui/icons-material/Apps";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { IconButton, Tooltip, tooltipClasses, TooltipProps, useMediaQuery } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  MessageCirclePlus,
  Settings,
} from "lucide-react";
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import LeftArrow from "./LeftArrow";
import OptionIcon from "./option-icon";
import ShareIcon from "./share-icon";
import RenameIcon from "./rename-icon";
import ArchiveIcon from "./archive-icon";
import DeleteIcon from "./delete-icon";
import MenuNew from "./menu-new";
import ChatEdit from "./chat-edit";
const drawerWidth = 280;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: open ? 0 : `-${drawerWidth}px`,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));



const primaryNavItems = [
  { label: "Chat", href: "/chat", icon: LayoutDashboard },
  { label: "Teams", href: "/teams", icon: Building2 },
  { label: "Plans", href: "/plans", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { data } = useChatList();
  const [menu, setMenu] = React.useState(false);
  const location = useLocation();
  // const [pin,setpin] = React.useState(false)
  const { open, setOpen} = React.useContext(AppContext);
  const handleMenuOpen = () => setMenu(true);
  const handleMenuClose = () => setMenu(false);
  const handleDrawerClose = () => setOpen(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const [isDropdownOpen, setDropdownOpen] = React.useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = React.useState(null);
  const toggleDropdown = (index, e) => {
    e.stopPropagation();
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
    
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
  sx={{
    width: isMobile ? "100%" : isTab ? "35%" : drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: isMobile ? "100%" : isTab ? "35%" : drawerWidth,
      boxSizing: "border-box",
      // marginTop: "20px",
      backgroundColor: "#F9F9F9",
      overflowY: "auto", // Enables scrolling when content exceeds height
      maxHeight: "100vh", // Ensures the sidebar doesn't exceed viewport height
    },
  }}
  variant="persistent"
  anchor="left"
  open={open}
>
<DrawerHeader>
  <div className="flex justify-between w-full">
    <div className="flex-1" onClick={handleDrawerClose}>
      <MenuNew />
    </div>
    <div className="flex-none">
      <ChatEdit />
    </div>
  </div>
</DrawerHeader>

  {open && (
    <>
      <List>
        <div className="flex flex-col cursor-pointer px-4">
          <div className="flex justify-between mb-4">
            <p className="text-xl font-semibold">G-Chatter</p>
          </div>

          <div
            className="flex"
            onClick={() => {
              createNewChat();
              navigate("/chat");
              setOpen(false);
            }}
          >
            <MessageCirclePlus className="w-6 h-6 text-black" />
            <div className="ml-2">
              <p className="text-lg">Start new chat</p>
            </div>
          </div>
        </div>
      </List>

      <Divider />

      <List>
        <p className="flex text-base font-bold ml-4">Recents</p>
        <div className="px-2 py-0.5">
          {data.map((chat, index) => (
            <div key={index} className="relative mb-2">
              <div
                className={`flex items-center justify-between px-2 py-0.5 rounded-lg overflow-y-auto ${
                  index === 0 || hoveredIndex === index ? "bg-gray-200" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                }}
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    navigate(`/chat/${chat.chat_id}`);
                    setOpen(false);
                  }}
                >
                  <p
                    className="text-sm text-gray-700 truncate"
                    style={{
                      width: "200px", // Adjust this width as needed
                      padding: "0.5rem", // Consistent padding
                    }}
                  >
                    {chat.last_message}
                  </p>
                </div>

                {(index === 0 || hoveredIndex === index) && (
                  <div className="relative inline-block">
                    <BootstrapTooltip title="Options" placement="top-start">
                      <button
                        onClick={(e) => toggleDropdown(index, e)}
                        className="ml-2 p-1 text-sm text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-300"
                      >
                        <OptionIcon />
                      </button>
                    </BootstrapTooltip>

                    {activeDropdownIndex === index && (
                      <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <ul className="py-2 text-sm text-gray-700">
                          <button className="flex gap-3 w-full text-left px-4 py-2 hover:bg-gray-100">
                            <ShareIcon />
                            Share
                          </button>

                          <button className="flex gap-3 w-full text-left px-4 py-2 hover:bg-gray-100">
                            <RenameIcon />
                            Rename
                          </button>

                          <button className="flex gap-3 w-full text-left px-4 py-2 hover:bg-gray-100">
                            <ArchiveIcon />
                            Archive
                          </button>

                          <button className="flex gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                            <DeleteIcon />
                            Delete
                          </button>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </List>
    </>
  )}
</Drawer>

    </Box>
  );
}
