import { useAuth } from "@/hooks/useAuth";
import { useContext, useEffect } from "react";

import DarkLogo from "@/assets/Logo/DarkLogo";
import AppContext from "../context/AppContext";
import MenuNew from "../ui/menu-new";
import TooltipNew from "../ui/tooltipnew";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

export function Header() {
  const { signOut, user } = useAuth();
  const { open, setOpen, createNewChat } = useContext(AppContext);

  useEffect(() => {
    if (!user) {
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const handleDrawer = () => {
    setOpen(true);
  };
  const getInitials = (name) => {
    if (!name) return '?';
    const nameParts = name.trim().split(' ');
    return nameParts.length > 1
      ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
      : nameParts[0][0].toUpperCase();
  };

  const initials = getInitials(user?.name);
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
                <MenuNew />
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
        {user && (  <div className="flex items-center">
        <TooltipNew
  title={
    <>
      <div>{user?.name}</div>
      <div>{user?.email}</div>
    </>
  }
>
          <Avatar
  sx={{ bgcolor: deepOrange[500] }}
  alt="Remy Sharp"
  src="/broken-image.jpg"
>
  {initials}
</Avatar>
          </TooltipNew>
    
        </div>)}
      
      </div>

      {/* Right section - fixed position */}
    </header>
  );
}
