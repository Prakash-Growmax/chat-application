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
import TokenIcon from '@mui/icons-material/Token';
const drawerWidth = 280;



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
    setActiveDropdownIndex(prevIndex => prevIndex === index ? null : index);
  };

  return(
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
  sx={{
    width: isMobile ? "100%" : isTab ? "35%" : drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: isMobile ? "100%" : isTab ? "35%" : drawerWidth,
      boxSizing: "border-box",
      backgroundColor: "#F9F9F9",
      display: "flex", // Ensure flex layout
      flexDirection: "column", // Align header, content, footer vertically
      maxHeight: "100vh", // Limit height to viewport
    },
  }}
  variant="persistent"
  anchor="left"
  open={open}
>
  {/* Drawer Header */}
  <DrawerHeader
    sx={{
      position: "sticky", // Makes the header fixed
      top: 0,
      zIndex: 10,
      backgroundColor: "#F9F9F9",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Optional for a shadow effect
    }}
  >
    <div className="flex justify-between w-full">
      <div className="flex-1" onClick={handleDrawerClose}>
        <MenuNew />
      </div>
      <div className="flex-none">
        <ChatEdit />
      </div>
    </div>
  </DrawerHeader>

  {/* Scrollable Content */}
  <Box
    sx={{
      flexGrow: 1, // Takes up available space
      overflowY: "auto", // Enables scrolling
    }}
  >
    <List>
      <div className="flex flex-col cursor-pointer px-2">
        <div className="flex justify-between w-full group hover:bg-gray-200 rounded-lg px-2 py-2">
          <div className="flex">
            <p className="text-base">ChatGpt</p>
          </div>
          <div className="flex-none opacity-0 group-hover:opacity-100">
            <ChatEdit />
          </div>
        </div>
      </div>
    </List>
    <Divider />
    <div className="w-full">
      <List>
        <p className="flex text-base font-bold ml-4">Recents</p>
        <div className="px-2 py-0.5">
          {data.map((chat, index) => (
            <div key={index} className="relative mb-2">
              <div
                className={`flex items-center justify-between px-2 py-0.5 rounded-lg ${
                  index === 0 || hoveredIndex === index ? "bg-gray-200" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    navigate(`/chat/${chat.chat_id}`);
                    setOpen(false);
                  }}
                >
                  <p
                    className="text-sm text-gray-700 truncate px-2 py-2"
                    style={{ width: "200px" }}
                  >
                    {chat.last_message}
                  </p>
                </div>
                {(index === 0 || hoveredIndex === index) && (
                  <div className="relative dropdown-container">
                    <BootstrapTooltip title="Options" placement="top-start">
                      <button
                        onClick={(e) => toggleDropdown(index, e)}
                        className="ml-2 p-1 text-sm text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-300"
                      >
                        <OptionIcon />
                      </button>
                    </BootstrapTooltip>
                    {activeDropdownIndex === index && (
                      <div
                        className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
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
                )}
              </div>
            </div>
          ))}
        </div>
      </List>
    </div>
  </Box>

  {/* Drawer Footer */}
  <Box
    sx={{
      position: "sticky", // Makes the footer fixed
      bottom: 0,
      zIndex: 10,
      backgroundColor: "#F9F9F9",
      boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)", // Optional for a shadow effect
      padding: theme.spacing(2),
    }}
  >
    <div className="flex gap-3 items-center justify-center hover:bg-gray-200 px-2 py-2 rounded-lg" onClick={()=>{navigate("/plans")}}>
     <TokenIcon/>
     <div className="flex flex-col">
     <p className="text-base">Upgrade plan</p>
     <p className="text-xs text-gray-500">More access to the best models</p>
     </div>
    

    </div>
  </Box>
</Drawer>


    </Box>
  );
}
