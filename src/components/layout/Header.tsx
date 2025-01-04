import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@mui/material";
import { CreditCard, LogOut, Settings, Users } from "lucide-react";
import { useContext } from "react";

import DarkLogo from "@/assets/Logo/DarkLogo";
import { Link } from "react-router-dom";
import AppContext from "../context/AppContext";
import MenuNew from "../ui/menu-new";
import TooltipNew from "../ui/tooltipnew";

export function Header() {
  const { signOut } = useAuth();
  const { open, setOpen, createNewChat } = useContext(AppContext);
  const handleDrawer = () => {
    setOpen(true);
  };

  return (
    <header className="fixed top-0 w-full h-16 bg-white z-50">
      <div className="relative h-full flex items-center justify-between px-4">
        {/* Left section with fixed width container */}
        <div className="relative flex items-center w-auto space-x-2">
          <TooltipNew title="Expand Menu" placement="top-start">
          <button
            className="p-2 hover:bg-gray-100 rounded-md"
            onClick={handleDrawer}
          >
            <MenuNew />
          </button>
          </TooltipNew>
       

          {/* ChatGPT Label */}
          {!open && (
            <div className="flex items-center ml-4">
              <DarkLogo />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 rounded-full cursor-pointer">
                <Avatar alt="Menu" sx={{ width: 32, height: 32 }} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/plans" className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Plans & Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/teams" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Teams
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Right section - fixed position */}
    </header>
  );
}
