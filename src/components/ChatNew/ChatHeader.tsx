import { ChatState } from '@/types';
import { useNavigate } from 'react-router-dom';
import LucideIcon from '../Custom-UI/LucideIcon';

interface ChatHeaderProps {
  setOpen: (leftside: boolean) => void;
  setOpenRight: (side: boolean) => void;
  createNewChat: () => void; // Removed (chat: string) if no argument is needed
  state: ChatState;
}

export default function ChatHeader({ createNewChat, state }: ChatHeaderProps) {
  const navigate = useNavigate();

  const handleCreateChat = () => {
    createNewChat(); // Ensure this matches the function signature
    navigate('/chat');
  };

  return (
    <>
      {state.s3Key && (
        <div className="flex items-center gap-2">
          <div className="flex cursor-pointer" onClick={handleCreateChat}>
            <LucideIcon
              name="MessageCirclePlus"
              className="w-8 h-8 text-black ml-4"
            />
          </div>
        </div>
      )}
    </>
  );
}
