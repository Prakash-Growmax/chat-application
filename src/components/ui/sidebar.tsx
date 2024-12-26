import { useChatList } from "@/hooks/useChatList";
import { cn } from "@/lib/utils";
import AppsIcon from "@mui/icons-material/Apps";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { IconButton, useMediaQuery } from "@mui/material";
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

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface SideBarProps {
  open: boolean;
  setOpen: (side: boolean) => void;
  createNewChat: (chat: string) => void;
}

const primaryNavItems = [
  { label: "Chat", href: "/chat", icon: LayoutDashboard },
  { label: "Teams", href: "/teams", icon: Building2 },
  { label: "Plans", href: "/plans", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({
  open,
  setOpen,
  createNewChat,
}: SideBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { data } = useChatList();
  const [menu, setMenu] = React.useState(false);
  const location = useLocation();

  const handleMenuOpen = () => setMenu(true);
  const handleMenuClose = () => setMenu(false);
  const handleDrawerClose = () => setOpen(false);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width:isMobile ? '100%' : isTab ? '25%' : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width:isMobile ? '100%' : isTab ? '25%' : drawerWidth,
            boxSizing: 'border-box',
            marginTop: '70px',
            backgroundColor: '#F6F8FA',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open || menu}
      >
        {isTab && menu && (
          <>
            <DrawerHeader>
              <div className="fixed flex top-20 left-0 flex items-center">
                <IconButton onClick={handleMenuClose}>
                  <ChevronLeftIcon />
                </IconButton>
                <p className="text-lg ml-8">Menu</p>
              </div>
            </DrawerHeader>
            <Divider />
            <List>
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex h-10 items-center rounded-md px-4 py-8 text-xl font-medium transition-colors hover:bg-gray-100",
                        location.pathname === item.href
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600"
                      )}
                      onClick={() => {
                        setOpen(false);
                        setMenu(false);
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex-1 ml-4">{item.label}</div>
                      <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                  </li>
                );
              })}
            </List>
          </>
        )}
        {open && !menu && (
          <>
            <List>
              <div
                className="flex flex-col cursor-pointer px-4"
                onClick={() => {
                  createNewChat();
                  navigate("/chat");
                  setOpen(false);
                }}
              >
                <div className="flex justify-end" onClick={handleDrawerClose}>
                  <KeyboardBackspaceIcon className="ml-auto" />
                </div>

                <div className="flex">
                  <MessageCirclePlus className="w-6 h-6 text-black" />
                  <div className="ml-2">
                    <p className="text-lg">Start new chat</p>
                  </div>
                </div>
              </div>
              {isTab && (
                <div>
                  <Divider />
                  <div className="flex py-4" onClick={handleMenuOpen}>
                    <AppsIcon className="ml-4" />
                    <p className="text-lg ml-4">Menu</p>
                    <div className="flex ml-auto">
                      <ChevronRightIcon />
                    </div>
                  </div>
                  <Divider />
                </div>
              )}
            </List>
            <List>
              <p className="flex text-base font-bold ml-4">Recents</p>
              {data.map((chat, index) => (
                <ListItem key={index} className="flex items-center">
                  <div
                    className="flex"
                    onClick={() => {
                      navigate(`/chat/${chat.chat_id}`);
                      setOpen(false);
                    }}
                  >
                    <ListItemIcon className="min-w-[30px] mr-2 mt-2">
                      <ChatBubbleOutlineIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <p className="text-sm text-gray-700 truncate w-[200px] -ml-8">
                          {chat.last_message}
                        </p>
                      }
                    />
                  </div>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Drawer>
    </Box>
  );
}
