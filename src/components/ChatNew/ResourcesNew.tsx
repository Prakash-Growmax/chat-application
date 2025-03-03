import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import UserResource from "../auth/UserResource";
import LucideIcon from "../Custom-UI/LucideIcon";
import { useContext} from "react";

import AppContext from "../context/AppContext";
import { useMediaQuery, useTheme } from "@mui/material";

const ResourcesNew = () => {
  const navigate = useNavigate();
  const { signOut} = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));

  const {setSideDrawerOpen} = useContext(AppContext);
  // const handleLogout = async () => {
    

 
  //   try {
  //     // Use resetAuth to ensure complete logout and token clearing
  //     await resetAuth();
  //     navigate('/login');
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //     toast({
  //       title: 'Logout Failed',
  //       description: 'Unable to log out. Please try again.',
  //       variant: 'destructive',
  //     });
  //   }
  // };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <UserResource />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[330px] lg:w-56 md:w-48 z-[1400] bg-white border-gray-200 rounded-lg shadow-xl"
          side="top"
          align="center"
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="gap-3 hover:bg-gray-200 cursor-pointer"
              onClick={() =>{  navigate(`/plans`)
                if(isMobile || isTab){
                 setSideDrawerOpen(false)
                }} 
              
              }
            >
              <LucideIcon name="Wallet" size={14} color="black" />
              <span>Subscription</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="gap-3 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                navigate(`/teams`)
                if(isMobile || isTab){
                  setSideDrawerOpen(false)
                 }
              }}
            >
              <LucideIcon name="Users" size={14} color="black" />
              <span>Teams</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="gap-3 hover:bg-gray-200 cursor-pointer"
              onClick={() => {navigate(`/settings`)
                if(isMobile || isTab){
                  setSideDrawerOpen(false)
                 }
              }}
            >
              <LucideIcon name="SquareUser" size={14} color="black" />
              <span>Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className={`gap-3 hover:bg-gray-200 cursor-pointer `}
              onClick={signOut}
             
            >
              <LucideIcon name="LogOut" size={14} color="black" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ResourcesNew;
