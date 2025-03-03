
import { useAuth } from "@/hooks/useAuth";
import { BodyText } from "@/Theme/Typography";
import { getInitials } from "@/utils/general.utilis";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";


function ChatTypeInfo() {
  const { user } = useAuth();
  const userName = user?.name || "";
  return (
    <div className="flex flex-row mb-1 items-center justify-start">
     
        <div className="flex gap-1 pt-2">
          <Avatar
            sx={{
              bgcolor: deepOrange[500],
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
          <BodyText className="ml-1">You</BodyText>
        </div>
     
    </div>
  );
}

export default ChatTypeInfo;
