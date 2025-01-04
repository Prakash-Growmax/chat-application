import DarkLogo from "@/assets/Logo/DarkLogo";
import { useChatList } from "@/hooks/useChatList";

import { Tooltip, tooltipClasses, TooltipProps, useMediaQuery } from "@mui/material";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";



import TokenIcon from '@mui/icons-material/Token';
import MenuClose from "./menu-close";
import MyRecent from "../ChatNew/MyRecent";
import Resources from "../ChatNew/Resources";
import AppContext from "../context/AppContext";
import ChatEdit from "./chat-edit";
import LogoutIcon from "./logout-icon";
import { useAuth } from "@/hooks/useAuth";
import WorkFlow from "./workflow";
import MyFiles from "./my-file";
import ResourcesIcon from "./resources-icons";
import ProfileLoginIcon from "./profilelog-icon";
const drawerWidth = 250;

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

export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();


  // const [pin,setpin] = React.useState(false)
  const { open, setOpen } = React.useContext(AppContext);

  const handleDrawerClose = () => setOpen(false);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const [isDropdownOpen, setDropdownOpen] = React.useState(false);
    const { user, signOut } = useAuth();
  const [activeDropdownIndex, setActiveDropdownIndex] = React.useState(null);
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
    setActiveDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
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
            backgroundColor: "#F9F9F9",
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#F9F9F9",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex justify-between w-full px-2">
            <div className="flex-1">
              <p
                className="text-xl text-[#52D999] font-semibold"
                style={{
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                }}
              >
                Ansight
              </p>
            </div>
            <div className="flex-none" onClick={handleDrawerClose}>
              <MenuClose />
            </div>
          </div>
        </DrawerHeader>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <List>
            <div className="flex flex-col">
              <div className="flex items-center justify-center px-2 py-2">
                <button className="group bg-white w-[176px] h-[31px] px-2.5 py-1.5 border border-gray-100 rounded-md text-sm flex items-center justify-center hover:text-black shadow">
                  <span className="flex items-center gap-2">
                    <ChatEdit />
                    <span className="text-sm text-gray-500 group-hover:text-black">
                      New Thread
                    </span>
                  </span>
                </button>
              </div>
              <div className="flex items-center px-2 gap-2">
                <div>
                  <WorkFlow />
                </div>
                <p className="text-base font-semibold">Workspace</p>
              </div>
            </div>
          </List>
          <Divider />
          <div className="w-full">
            <List>
              <div className="flex flex-col gap-1 px-4 py-4">
                <MyRecent
                  isDropdownOpen={isDropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                />
                <div
                  className={`overflow-hidden transition-all duration-100 ease-in-out ${
                    isDropdownOpen ? "mt-40" : ""
                  }`}
                >
                  <MyFiles />
                </div>
              </div>
            </List>
            <div>
              <div className="flex items-center px-2 gap-2 py-2">
                <div>
                  <ResourcesIcon />
                </div>
                <p className="text-base font-semibold">Resources</p>
              </div>
              <Divider />
              <div className="flex px-4 py-4">
                <Resources />
              </div>
            </div>
          </div>
        </Box>

        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            backgroundColor: "#F9F9F9",
            boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex py-2 px-2.5" onClick={signOut}>
            <LogoutIcon />
            <p className="flex text-sm font-medium ml-4 cursor-pointer">
              Logout
            </p>
          </div>
          <div
            className="flex gap-3 hover:bg-gray-200 px-2.5 py-4 rounded-lg"
            onClick={() => {
              navigate("/plans");
            }}
          >
            <ProfileLoginIcon />
            <div className="flex flex-col">
              <p className="text-sm">Ajitha Jeeva</p>
              <p className="text-xs text-gray-500">ajitha@apptino.com</p>
            </div>
          </div>
        </Box>
      </Drawer>
    </Box>
  );

}
