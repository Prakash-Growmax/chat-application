import Spinner from "@/components/ui/Spinner";
import { useChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { S3UploadError, uploadToS3 } from "@/lib/s3-client";
import { chatService } from "@/services/ChatService";
import { formQueueMessage } from "@/utils/chat.utils";
import { getAccessToken, getChatId } from "@/utils/storage.utils";
import { Tooltip } from "@mui/material";
import { Paperclip } from "lucide-react";
import { useCallback, useState } from "react";

function ChatUploadBtn({
  onFileUploaded,
  setS3Key,
}: {
  onFileUploaded: (s3Key: string) => void;
  setS3Key: (fileName: string) => void;
}) {
  const { profile } = useProfile();
  const { addToQueue } = useChatContext();

  const [isUploading, setIsUploading] = useState(false);
  const chatId = getChatId() || "";
  const token = getAccessToken();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        console.error("No file selected");
        return;
      }

      setIsUploading(true);

      try {
     
        const s3Key = await uploadToS3(file, () => {});
    

       
        if (profile?.organization_id) {
        

          const result = await chatService.uploadDataset(
            {
              s3_path: `s3://growmax-dev-app-assets/analytics/${file.name}`,
              org_id: profile.organization_id,
              type: "unknown",
            },
            chatId,
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

          // Create and add a success message to the chat queue
          const queueMsg = formQueueMessage(
            "Success! Your file has been uploaded successfully. Ask questions regarding the uploaded file.",
            true,
            result.data
          );
          addToQueue(queueMsg);
        } else {
          console.warn("Profile or organization ID is missing.");
        }

       
        setS3Key(file.name);
     

        onFileUploaded(s3Key);
       
      } catch (error) {
        if (error instanceof S3UploadError) {
          console.error("S3 Upload Error:", error.message);
        } else {
          console.error("Error uploading file:", error);
        }
      } finally {
        setIsUploading(false);
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
          {isUploading ? <Spinner /> : <Paperclip />}
        </button>
      </Tooltip>
    </div>
  );
}

export default ChatUploadBtn;
