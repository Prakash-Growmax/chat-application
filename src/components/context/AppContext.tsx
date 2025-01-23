import { drawerWidth } from "@/constants/general.constant";
import React from "react";

interface AppContextType {
  sideDrawerOpen: boolean;
  setSideDrawerOpen: (value: boolean) => void;
  sideDrawerWidth: number;
  MainLayout_MarginLeft: number;
}

const AppContext = React.createContext<AppContextType>({
  sideDrawerOpen: false,
  setSideDrawerOpen: () => {},
  sideDrawerWidth: drawerWidth,
  MainLayout_MarginLeft: drawerWidth + 16,
});

export default AppContext;
