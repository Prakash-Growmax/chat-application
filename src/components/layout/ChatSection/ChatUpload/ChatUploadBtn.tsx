import LucideIcon from "@/components/Custom-UI/LucideIcon";
import Spinner from "@/components/ui/Spinner";
import { useChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { createChatId } from "@/lib/chat/chat-service";
import { S3UploadError, uploadToS3 } from "@/lib/s3-client";
import { chatService } from "@/services/ChatService";
import { formQueueMessage } from "@/utils/chat.utils";
import { getAccessToken } from "@/utils/storage.utils";
import { Tooltip } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ChatUploadBtn({
  onFileUploaded,
  // setS3Key,
}: {
  onFileUploaded: (s3Key: string) => void;
  // setS3Key: (fileName: string) => void;
}) {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { addToQueue, setProcessing,setS3Key} = useChatContext();

  const [isUploading, setIsUploading] = useState(false);
  const { id: chatId } = useParams();
  const token = getAccessToken();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setS3Key(file.name);
      if (!file) {
        console.error("No file selected");
        return;
      }

      if (!profile) return true;

      let ID = chatId;

      try {
        if (!ID) {
          setIsUploading(true);
          setProcessing(true);
          ID = await createChatId(profile);
          setProcessing(false);
        }
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
      
     

      try {
        if (profile?.organization_id && ID) {
          setIsUploading(true)
          const result = await chatService.uploadDataset(
            {
              s3_path: `s3://growmax-dev-app-assets/analytics/${file.name}`,
              org_id: profile.organization_id,
              type: "sales",
            },
            ID,
            {
              headers: {
                "Content-Type": "application/json",
                "x-organization-id": profile.organization_id,
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (result.status !== 200) {
            throw new Error("Failed to upload dataset info");
          }
         
         
  
          navigate(`/chat/${ID}`);
          const response = {
            data: {
              response:{
                text:"Success! Your file has been uploaded successfully. Ask questions regarding the uploaded file.",
                suggested_questions:result?.data.suggested_questions
              }
             
            },
            type: "datasetres",
          };
          let assistantMessage;
          assistantMessage = formQueueMessage(response || "", true);
          addToQueue(assistantMessage);
          setIsUploading(false);
          await uploadToS3(file, () => {});
          
        } else {
          console.warn("Profile or organization ID is missing.");
        }
       
      } catch (error) {
        if (error instanceof S3UploadError) {
          console.error("S3 Upload Error:", error.message);
        } else {
          console.error("Error uploading file:", error);
        }
      } finally {
        // setIsUploading(false);
      }
    },
    [onFileUploaded, setS3Key, profile, chatId, token, addToQueue]
  );
  return (
    <div className="flex">
      {/* Hidden input for file selection */}
      <input
        type="file"
        accept=".csv"
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
