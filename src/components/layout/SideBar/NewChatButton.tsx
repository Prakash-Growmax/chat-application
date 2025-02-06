import AppContext from "@/components/context/AppContext";
import LucideIcon from "@/components/Custom-UI/LucideIcon";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function NewChatButton({
  isMobile,
  isTab,
}: {
  isMobile: boolean;
  isTab: boolean;
}) {
  const navigate = useNavigate();
  const { setSideDrawerOpen } = useContext(AppContext);
  return (
    <div className="flex items-center justify-center">
      <button
        className="group bg-white w-full py-2 px-1 border border-gray-200 rounded-md text-sm flex items-center justify-center hover:border-gray-300 hover:shadow-md transition duration-200 ease-in-out"
        onClick={async () => {
          navigate(`/chat/new`);
          if (isMobile || isTab) {
            setSideDrawerOpen(false);
          }
        }}
      >
        <span className="flex items-center gap-2">
          <LucideIcon name={"MessageSquarePlus"} size={20} />
          <span className="lg:text-sm md:text-base text-black text-base">
            New Thread
          </span>
        </span>
      </button>
    </div>
  );
}

export default NewChatButton;
