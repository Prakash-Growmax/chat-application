import LucideIcon from "@/components/Custom-UI/LucideIcon";
import Spinner from "@/components/ui/Spinner";
import { useChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { createChatId } from "@/lib/chat/chat-service";
import { uploadToS3 } from "@/lib/s3-client";
import { getAccessToken } from "@/utils/storage.utils";
import { Tooltip } from "@mui/material";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function ChatUploadBtn({
  onFileUploaded,
}: {
  onFileUploaded: (s3Key: string) => void;
}) {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { addToQueue, setProcessing, setS3Key, isUploading, setIsUploading } =
    useChatContext();

  const { id: chatId } = useParams();
  const token = getAccessToken();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      console.log(file)
      if (!file) {
        console.error("No file selected");
        return;
      }
      setIsUploading(true);
      await uploadToS3(file, (progress) => {
       
      });
      if (!profile) return true;
     
      let ID = chatId;
      const s3_key = `s3://growmax-dev-app-assets/analytics/${file.name}`;

      try {
        if (!ID) {
          setProcessing(true);
          ID = await createChatId(profile);
          setS3Key(s3_key);
          setProcessing(false);
          navigate(`/chat/${ID}`);
          return;
        } else {
          setS3Key(s3_key);
        }
      } catch (error) {
        toast.error("Error occurred while uploading. Try again");
      }
    },
    [onFileUploaded, setS3Key, profile, chatId, token, addToQueue]
  );
  return (
    <div className="flex">
      {/* Hidden input for file selection */}
      <input
        type="file"
        accept=".csv,.xls,.xlsx"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-upload"
        disabled={isUploading}
      />
      <Tooltip title="Upload CSV">
        <button
          type="button"
          className="flex items-center gap-2 text-black hover:bg-gray-100 rounded p-2 transition-colors"
          onClick={() => document.getElementById("csv-upload")?.click()}
        >
          {isUploading ? <Spinner /> : <LucideIcon name={"Paperclip"} />}
        </button>
      </Tooltip>
    </div>
  );
}

export default ChatUploadBtn;
