import DarkLogo from "@/assets/Logo/DarkLogo";

import { Divider, List, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";

import MyRecent from "../ChatNew/MyRecent";
import Resources from "../ChatNew/Resources";
import AppContext from "../context/AppContext";
import NewChatButton from "../layout/SideBar/NewChatButton";
import SideBarListItemHeader from "../layout/SideBar/SideBarListItemHeader";

import { drawerWidth } from "@/constants/general.constant";
import { CloudCog, Layers, PanelRightOpen } from "lucide-react";
import LogoutButton from "../auth/LogoutButton";
import TooltipNew from "./tooltipnew";
import { DrawerOpen_LocalKey } from "@/constants/storage.constant";
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 1),
  // ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
const Backdrop = styled("div")`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1200;
  transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);
`;
export default function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const { sideDrawerOpen, setSideDrawerOpen } = React.useContext(AppContext);

  const handleDrawerClose = () => {
    setSideDrawerOpen(false);
    localStorage.setItem(DrawerOpen_LocalKey,JSON.stringify(false))
  };
  const [isDropdownOpen, setDropdownOpen] = React.useState(true);
  const [activeDropdownIndex, setActiveDropdownIndex] = React.useState(null);
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

  // React.useEffect(() => {
  //   if (user) {
  //     setSideDrawerOpen(true);
  //   }
  // }, [user]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {sideDrawerOpen && (isMobile || isTab) && (
        <Backdrop onClick={handleDrawerClose} />
      )}
      <Drawer
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#F9F9F9",
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh",
            zIndex: 1300, // Ensure drawer is above backdrop
          },
        }}
        variant="persistent"
        anchor="left"
        open={sideDrawerOpen}
      >
        <DrawerHeader
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#F9F9F9",
          }}
        >
          <div className="flex w-full px-2 justify-between items-center">
            <div>
              <DarkLogo />
            </div>
            <div
              className="flex-none cursor-pointer"
              onClick={handleDrawerClose}
            >
              <TooltipNew title="Close Menu" placement="top-start">
                <PanelRightOpen size={24} />
              </TooltipNew>
            </div>
          </div>
        </DrawerHeader>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            paddingLeft: "7.6px",
            paddingRight: "7.6px",
          }}
        >
          <NewChatButton isMobile={isMobile} isTab={isTab} />
          <SideBarListItemHeader icon={Layers} title="Workspace" />
          <div className="w-full">
            <List>
              <div className="flex flex-col">
                <MyRecent
                  isDropdownOpen={isDropdownOpen}
                  setDropdownOpen={setDropdownOpen}
                  isMobile={isMobile}
                  isTab={isTab}
                />
                <div
                  className={`overflow-hidden transition-all duration-100 ease-in-out ${
                    isDropdownOpen ? "mt-40" : ""
                  }`}
                ></div>
              </div>
            </List>
            <div>
              <div className="flex items-center gap-2">
                <SideBarListItemHeader icon={CloudCog} title="Resources" />
              </div>
              <Divider />
              <div className="flex">
                <Resources />
              </div>
            </div>
          </div>
        </Box>

        <Box
          sx={{
            padding: 1,
            position: "sticky",
            zIndex: 10,
            backgroundColor: "#F9F9F9",
            boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)",
            display: "flex", // Set display to flex
            justifyContent: "center", // Horizontally center items
            alignItems: "center", // Vertically center items
          }}
        >
          <LogoutButton />
        </Box>
      </Drawer>
    </Box>
  );
}
