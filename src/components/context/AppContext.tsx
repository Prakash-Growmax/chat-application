import { drawerWidth } from "@/constants/general.constant";
import React from "react";

interface AppContextType {
  sideDrawerOpen: boolean;
  setSideDrawerOpen: (value: boolean) => void;
  historyList:boolean;
  setHistoryList: (value:boolean) => void;
  sideDrawerWidth: number;
  MainLayout_MarginLeft: number;
}

const AppContext = React.createContext<AppContextType>({
  sideDrawerOpen:true,
  setSideDrawerOpen: () => {},
  historyList:false,
  setHistoryList: () => {},
  sideDrawerWidth: drawerWidth,
  MainLayout_MarginLeft: drawerWidth + 16,
});

export default AppContext;
