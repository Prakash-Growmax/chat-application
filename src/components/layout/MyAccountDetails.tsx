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
import { Caption, Label, ListItemHeaderText } from "@/Theme/Typography";
import { capitalizeFirstName, getInitials } from "@/utils/general.utilis";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import LogoutButton from "../auth/LogoutButton";
import LucideIcon from "../Custom-UI/LucideIcon";
import { useNavigate } from "react-router-dom";

export default function MyAccountDetails() {
  const { user, signOut } = useAuth();
  const tokens = useTokenUsage();
  const tokens_used = tokens?.data?.current_token_usage;
  const tokens_remaining = tokens?.data?.tokens_remaining;
  const userName = user?.name || "";
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-cente  r">
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
            <ListItemHeaderText className="truncate p-2">
              My Account
            </ListItemHeaderText>
            <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
            <DropdownMenuGroup>
                        
                        <DropdownMenuItem className="gap-3">
                            <LucideIcon name="User" size={14} color="black" />
                            <Label className="pb-1">{capitalizeFirstName(userName)}</Label>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
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
                             <DropdownMenuItem className="gap-3 hover:bg-gray-200 cursor-pointer" onClick={() => signOut()}>
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
