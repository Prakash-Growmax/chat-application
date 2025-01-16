import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useTheme } from "@mui/material/styles";

import CloseIcon from "@mui/icons-material/Close";
import { Card, CardMedia, useMediaQuery } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import textImg from "../../assets/new.png";

const drawerWidth = 400;

export default function RightSideBar({ openRight, setOpenRight }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerClose = () => {
    setOpenRight(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer
        sx={{
          width: isMobile ? "100%" : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : drawerWidth,
            top: isMobile ? 0 : "110px", // Adjust top for mobile
            right: isMobile ? 0 : "20px", // Adjust right for mobile
            height: isMobile ? "100%" : "650px", // Adjust height for mobile
            backgroundColor: "#F6F8FA",
            borderRadius: isMobile ? 0 : "16px", // No rounded corners on mobile
            boxShadow: isMobile ? "none" : "0px 4px 10px rgba(0, 0, 0, 0.1)", // No shadow on mobile
          },
        }}
        variant="persistent"
        anchor="right"
        open={openRight}
      >
        <div className="flex flex-col">
          <div className="flex mt-4 justify-between px-8">
            <div>
              <span className="text-lg font-semibold">Chat controls</span>
            </div>

            <div>
              <CloseIcon onClick={handleDrawerClose} />
            </div>
          </div>
          <div className="flex px-8 mt-4">
            <span className="text-sm font-semibold text-gray-500">content</span>
          </div>
          <div className="flex px-8 mt-4">
            <Card sx={{ display: "flex", width: "387px", height: "60px" }}>
              <CardMedia
                component="img"
                sx={{ width: 70, padding: "10px" }}
                image={textImg}
                alt="Live from space album cover"
              />
              <span className="breakwords text-sm font-semibold ml-4 mt-4">
                Screenshoot.png
              </span>
            </Card>
          </div>
        </div>
      </Drawer>
    </Box>
  );
}
