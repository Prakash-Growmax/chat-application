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

export default function MyAccountDetails() {
  const { user, signOut } = useAuth();
  const tokens = useTokenUsage();
  const tokens_used = tokens?.data?.current_token_usage;
  const tokens_remaining = tokens?.data?.tokens_remaining;
  const userName = user?.name || "";

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
              <DropdownMenuItem className="flex flex-col justify-start items-start p-2">
                <Label className="pb-1">{capitalizeFirstName(userName)}</Label>
                <Caption className="truncate pb-2">{user?.email}</Caption>
                <Caption className="pb-1">
                  {tokens_used}/{tokens_remaining} tokens used
                </Caption>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
            <LogoutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
