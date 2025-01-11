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
import { deepOrange } from "@mui/material/colors";
import { LogOut, Mail, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlanIcon from "../ui/plan-icon";
import TokenIcon from "./icons/token-icon";
export default function MyAccountDetails() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const getInitials = (name: any) => {
    if (!name) return "?";
    const nameParts = name.trim().split(" ");
    return nameParts.length > 1
      ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
      : nameParts[0][0].toUpperCase();
  };

  const initials = getInitials(user?.name);
  function capitalizeFirstName(name: string) {
    if (!name) return ""; // Handle empty or null input
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  const userName = user?.name || "";
  const capitalizedName = capitalizeFirstName(userName);
  return (
    <>
      {user && (
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar
                className="cursor-pointer"
                sx={{ bgcolor: deepOrange[500] }}
                alt="Remy Sharp"
                src="/broken-image.jpg"
              >
                {initials}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[200px] max-w-[300px] bg-white border-none shadow-[0_2px_4px_rgba(0,0,0,0.1),0_-1px_2px_rgba(0,0,0,0.1)] mr-2">
              <DropdownMenuLabel className="truncate">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <div className="flex gap-4 truncate">
                    <User className="w-5 h-5" />
                    <span>{capitalizedName}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex gap-4 truncate">
                    <Mail className="w-5 h-5" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex gap-4 truncate">
                    <TokenIcon />
                    <span>{user?.tokenUsage}/1000</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex gap-4 truncate items-center">
                    <PlanIcon />
                    <span>{user?.plan}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <div
                    className="flex gap-4 cursor-pointer"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <div className="flex gap-4 cursor-pointer" onClick={signOut}>
                    <LogOut className="w-5 h-5" />
                    <span>Log out</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}
