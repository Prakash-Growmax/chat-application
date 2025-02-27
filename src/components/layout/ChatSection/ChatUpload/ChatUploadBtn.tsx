import AppContext from "@/components/context/AppContext";
import LucideIcon from "@/components/Custom-UI/LucideIcon";
import Spinner from "@/components/ui/Spinner";
import { useChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { createChatId } from "@/lib/chat/chat-service";
import { uploadToS3 } from "@/lib/s3-client";
import { getAccessToken } from "@/utils/storage.utils";
import { Tooltip } from "@mui/material";
import { useCallback, useContext, useState } from "react";
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
  const {setHistoryList} = useContext(AppContext);
  const { id: chatId } = useParams();
  const token = getAccessToken();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
    
      if (!file) {
        console.error("No file selected");
        return;
      }
      setIsUploading(true);
      setS3Key(file.name);
     
      if (!profile) return true;
     
      let ID = chatId;
      // const s3_key = `s3://growmax-dev-app-assets/analytics/${file.name}`;

      try {
        if (!ID) {
          setProcessing(true);
          ID = await createChatId(profile,setHistoryList);
          // setS3Key(s3_key);
          setProcessing(false);
          navigate(`/chat/${ID}`);
          return;
        } else {
          // setS3Key(s3_key);
        }
      } catch (error) {
        toast.error("Error occurred while uploading. Try again");
      }
      await uploadToS3(file, (progress) => {
       
      });
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
