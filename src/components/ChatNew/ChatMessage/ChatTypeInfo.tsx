import DarkLogo from "@/assets/Logo/DarkLogo";
import { useAuth } from "@/hooks/useAuth";
import { BodyText } from "@/Theme/Typography";
import { Avatar } from "@mui/material";
import { deepOrange } from "@mui/material/colors";

function ChatTypeInfo({ isUser }: { isUser: boolean }) {
  const { user } = useAuth();
  const getInitials = (name) => {
    if (!name) return "?";
    const nameParts = name.trim().split(" ");
    return nameParts.length > 1
      ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
      : nameParts[0][0].toUpperCase();
  };

  const initials = getInitials(user?.name);
  return (
    <div className="flex flex-row mb-2 items-center justify-start">
      {isUser ? (
        <>
          <Avatar
            sx={{
              bgcolor: deepOrange[500],
              padding: 1.5,
              width: 20,
              height: 20,
              fontSize: "0.7rem",
            }}
            alt="Remy Sharp"
            src="/broken-image.jpg"
          >
            {initials}
          </Avatar>
          {/* <UserIcon className="w-8 h-8" /> */}
          <BodyText className="ml-2 ">You</BodyText>
        </>
      ) : (
        <>
          <DarkLogo />
        </>
      )}
    </div>
  );
}

export default ChatTypeInfo;
