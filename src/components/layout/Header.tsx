import { useAuth } from "@/hooks/useAuth";
import { useContext, useEffect } from "react";

import DarkLogo from "@/assets/Logo/DarkLogo";
import { PanelLeftOpen } from "lucide-react";
import AppContext from "../context/AppContext";
import TooltipNew from "../ui/tooltipnew";
import MyAccountDetails from "./MyAccountDetails";

export function Header() {
  const { user } = useAuth();
  const { open, setOpen } = useContext(AppContext);

  const handleDrawer = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!user) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
