import UserIcon from "@/assets/Icons/UserIcon";
import DarkLogo from "@/assets/Logo/DarkLogo";
import LogoIcon from "@/assets/Logo/LogoIcon";

function ChatTypeInfo({ isUser }: { isUser: boolean }) {
  return (
    <div className="flex flex-row mb-2 items-center justify-start">
      {isUser ? (
        <>
          <UserIcon className="w-8 h-8" />
          <p className="ml-2 font-normal text-sm">You</p>
        </>
      ) : (
        <>
         <DarkLogo/>
        </>
      )}
    </div>
  );
}

export default ChatTypeInfo;
