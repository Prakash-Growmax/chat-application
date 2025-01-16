import React from "react";

interface AppContextType {
  sideDrawerOpen: boolean;
  setSideDrawerOpen: (value: boolean) => void;
  openRight: boolean;
  setOpenRight: (value: boolean) => void;
}

const AppContext = React.createContext<AppContextType>({
  sideDrawerOpen: false,
  setSideDrawerOpen: () => {},
  openRight: false,
  setOpenRight: () => {},
});

export default AppContext;
