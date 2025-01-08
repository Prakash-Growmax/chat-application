import ChatEdit from "@/components/ui/chat-edit";
import { useNavigate } from "react-router-dom";

function NewChatButton() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center">
      <button
        className="group bg-white w-full py-2 px-1 border border-gray-200 rounded-md text-sm flex items-center justify-center hover:border-gray-300 hover:shadow-md transition duration-200 ease-in-out"
        onClick={() => {
          navigate("/chat");
        }}
      >
        <span className="flex items-center gap-2">
          <ChatEdit className="text-black" />
          <span className="text-xs text-black">New Thread</span>
        </span>
      </button>
    </div>
  );
}

export default NewChatButton;
