import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import {Label, ListItemHeaderText } from "@/Theme/Typography";
import { capitalizeFirstName, getInitials } from "@/utils/general.utilis";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

import LucideIcon from "../Custom-UI/LucideIcon";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function MyAccountDetails() {
  const { user, signOut} = useAuth();


  const userName = user?.name || "";
  const navigate = useNavigate();

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
    <>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar
              className="cursor-pointer"
              sx={{ bgcolor: deepOrange[500] }}
              alt="Remy Sharp"
              src="/broken-image.jpg"
            >
              {getInitials(userName)}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[200px] max-w-[300px] bg-white border-1 shadow-md mr-2">
            <div className="flex flex-col">
            <ListItemHeaderText className="truncate p-2">
              My Account
            </ListItemHeaderText>
            <div className="flex gap-3 ml-2">
            <LucideIcon name="User" size={14} color="black" />
            <Label className="pb-1">{capitalizeFirstName(userName)}</Label>
            </div>
            </div>
           

          
                      <DropdownMenuGroup>
                      <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
                                 <DropdownMenuItem className="gap-3 hover:bg-gray-200 cursor-pointer" onClick={() => navigate(`/plans`)}>
                                     <LucideIcon name="Wallet" size={14} color="black" />
                                     <span>Subscription</span>
                                 </DropdownMenuItem>
                             </DropdownMenuGroup>
                             <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
                             <DropdownMenuGroup>
                                 <DropdownMenuItem className="gap-3 hover:bg-gray-200 cursor-pointer" onClick={() => navigate(`/teams`)}>
                                     <LucideIcon name="Users" size={14} color="black" />
                                     <span>Teams</span>
                                 </DropdownMenuItem>
                             </DropdownMenuGroup>
                             <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
                             <DropdownMenuGroup>
                                 <DropdownMenuItem className="gap-3 hover:bg-gray-200 cursor-pointer" onClick={() => navigate(`/settings`)}>
                                     <LucideIcon name="SquareUser" size={14} color="black" />
                                     <span>Profile</span>
                                 </DropdownMenuItem>
                             </DropdownMenuGroup>
                             <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
                             <DropdownMenuGroup>
                             <DropdownMenuItem className="gap-3 hover:bg-gray-200 cursor-pointer" onClick={signOut}>
                                 <LucideIcon name="LogOut" size={14} color="black" />
                                 <span>Logout</span>
                             </DropdownMenuItem>
                             </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
