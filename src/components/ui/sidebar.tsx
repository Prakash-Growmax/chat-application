import DarkLogo from "@/assets/Logo/DarkLogo";

import { Divider, List, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import MyRecent from "../ChatNew/MyRecent";
import Resources from "../ChatNew/Resources";
import AppContext from "../context/AppContext";
import NewChatButton from "../layout/SideBar/NewChatButton";
import SideBarListItemHeader from "../layout/SideBar/SideBarListItemHeader";
import LogoutIcon from "./logout-icon";
import MenuClose from "./menu-close";
import MyFiles from "./my-file";
import ResourcesIcon from "./resources-icons";
import WorkFlow from "./workflow";
const drawerWidth = 200;
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
  const navigate = useNavigate();

  const { open, setOpen } = React.useContext(AppContext);

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [isDropdownOpen, setDropdownOpen] = React.useState(true);
  const { user, signOut } = useAuth();
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

  React.useEffect(() => {
    if (user) {
      setOpen(true);
    }
  }, [user]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {open && (isMobile || isTab) && <Backdrop onClick={handleDrawerClose} />}
      <Drawer
        sx={{
          width: isMobile ? "100%" : isTab ? "35%" : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? "70%" : isTab ? "55%" : drawerWidth,
            backgroundColor: "#F9F9F9",
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh",
            zIndex: 1300, // Ensure drawer is above backdrop
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
              <MenuClose />
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
          <List>
            <NewChatButton isMobile={isMobile} />
            <SideBarListItemHeader icon={WorkFlow} title="Workspace" />
          </List>
          <div className="w-full">
            <List>
              <div className="flex flex-col">
                <div>
                  <MyRecent
                    isDropdownOpen={isDropdownOpen}
                    setDropdownOpen={setDropdownOpen}
                    isMobile={isMobile}
                    isTab={isTab}
                  />
                </div>

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
              <div
                className="flex items-center gap-2 px-1"
                // style={{ marginBottom: "4.8px" }}
              >
                <SideBarListItemHeader icon={ResourcesIcon} title="Resources" />
                {/* <div>
                  <ResourcesIcon />
                </div>
                <div className="font-inter font-medium text-customColor text-[15px] leading-[20px]">
                  Resources
                </div> */}
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
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            backgroundColor: "#F9F9F9",
            boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.1)",
            padding: "9.6px",
            display: "flex", // Set display to flex
            justifyContent: "center", // Horizontally center items
            alignItems: "center", // Vertically center items
          }}
        >
          <div
            className="flex items-center gap-2 w-full hover:bg-gray-200 px-4 py-2 rounded-lg"
            style={{ marginBottom: "4.8px" }}
            onClick={signOut}
          >
            <div>
              <LogoutIcon />
            </div>
            <div className="font-inter font-medium text-customColor lg:text-[15px] md:text-[18px] text-[18px] leading-[20px]">
              Logout
            </div>
          </div>

          {/* <div
            className="flex gap-2 hover:bg-gray-200 hover:rounded-lg rounded-lg"
            onClick={() => {
              navigate("/plans");
            }}
            style={{paddingTop:"9.6px",paddingLeft:"9.6px",paddingRight:"9.6px",paddingBottom:"9.6px"}}
          > 
          <div className="flex items-center justify-center">
          <ProfileLoginIcon />
          </div>
          
            <div className="flex flex-col">
              <p className="font-inter text-black text-sm leading-5">{user?.name}</p>
              <p className="font-normal text-[11px] leading-[16px] text-[#64748b]">{user?.email}</p>
            </div>
          </div> */}
        </Box>
      </Drawer>
    </Box>
  );
}
