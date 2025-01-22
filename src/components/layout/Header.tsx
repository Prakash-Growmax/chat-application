import { useAuth } from "@/hooks/useAuth";
import { useContext } from "react";

import DarkLogo from "@/assets/Logo/DarkLogo";
import { PanelLeftOpen } from "lucide-react";
import AppContext from "../context/AppContext";
import TooltipNew from "../ui/tooltipnew";
import MyAccountDetails from "./MyAccountDetails";
import { DrawerOpen_LocalKey } from "@/constants/storage.constant";

export function Header() {
  const { user } = useAuth();
  const { sideDrawerOpen, setSideDrawerOpen } = useContext(AppContext);

  const handleDrawer = () => {
    setSideDrawerOpen(true);
    localStorage.setItem(DrawerOpen_LocalKey,JSON.stringify(true))
  };

  return (
    <header className="fixed top-0 w-full h-16 bg-white z-50">
      <div className="relative h-full flex items-center justify-between px-4">
        {/* Left section with fixed width container */}
        <div className="relative flex items-center w-auto space-x-2">
          {user && (
            <TooltipNew title="Expand Menu" placement="top-start">
              <button
                className="p-2 hover:bg-gray-100 rounded-md"
                onClick={handleDrawer}
              >
                <PanelLeftOpen size={24} />
                {/* <MenuNew /> */}
              </button>
            </TooltipNew>
          )}
          {/* ChatGPT Label */}
          {!open && (
            <div className="flex items-center ml-4">
              <DarkLogo />
            </div>
          )}
        </div>

        <MyAccountDetails />
      </div>
    </header>
  );
}
