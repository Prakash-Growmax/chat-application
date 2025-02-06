import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import UserResource from "../auth/UserResource";
import LucideIcon from "../Custom-UI/LucideIcon";
import { useNavigate } from "react-router-dom";
const ResourcesNew = () =>{
    const navigate = useNavigate();
    return(
        <div>
              <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      <UserResource />
    </div>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56 z-[1400] bg-white border-gray-200 rounded-lg shadow-xl" side="top" align="center"  portal>
    <DropdownMenuGroup>
      <DropdownMenuItem className="gap-3 cursor-pointer" onClick={()=>{ navigate(`/plans`)}}>
        <LucideIcon name="Wallet" size={14} color="black" />
        <span>Subscription</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200" />
    <DropdownMenuGroup>
      <DropdownMenuItem className="gap-3 cursor-pointer" onClick={()=>{ navigate(`/teams`)}}>
        <LucideIcon name="Users" size={14} color="black" />
        <span>Teams</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator className="w-[95%] mx-auto h-[1px] bg-gray-200"  />
    <DropdownMenuGroup>
      <DropdownMenuItem className="gap-3 cursor-pointer" onClick={()=>{ navigate(`/settings`)}}>
        <LucideIcon name="SquareUser" size={14} color="black" />
        <span>Profile</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>

        </div>
    )

}
export default ResourcesNew;