import { useAuth } from "@/hooks/useAuth";

import { BodyText } from "@/Theme/Typography";
import { getInitials } from "@/utils/general.utilis";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

const UserResource = () =>{
    const { user} = useAuth();
   
 
    const userName = user?.name 
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1) 
    : "";
    
    return(
      <>
  
      <div className="flex items-center gap-3 w-full bg-gray-200 px-4 py-2 rounded-lg cursor-pointer">

<Avatar
   className="cursor-pointer"
   sx={{ bgcolor: deepOrange[500],
     padding: 1.5,
     width:"24px",
     height:"24px",
     fontSize: "0.7rem",
   }}
   alt="Remy Sharp"
   src="/broken-image.jpg"
 >
   {getInitials(userName)}
 </Avatar>
 <div className="-mt-0.5">
 <BodyText>
   {userName}
 </BodyText>
 </div>

 
        </div>

       
       
      </>
    
    )

}
export default UserResource;