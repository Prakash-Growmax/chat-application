import React from "react";

interface AppContextType {
  sideDrawerOpen: boolean;
  setSideDrawerOpen: (value: boolean) => void;

}

const AppContext = React.createContext<AppContextType>({
  sideDrawerOpen: false,
  setSideDrawerOpen: () => {},

});

export default AppContext;
