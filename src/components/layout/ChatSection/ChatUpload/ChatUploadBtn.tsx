import { useProfile } from "@/hooks/profile/useProfile";
import { S3UploadError, uploadToS3 } from "@/lib/s3-client";
import { Tooltip } from "@mui/material";
import { Loader, Paperclip } from "lucide-react";
import { useCallback, useState } from "react";

function ChatUploadBtn(onFileUploaded: (s3Key: string) => void) {
  const { profile } = useProfile();

  const [isUploading, setIsUploading] = useState(false);
  const chatId = localStorage.getItem("chatId") || "";
  const token = localStorage.getItem("supabase.auth.token") || "";
  const tokenJson = JSON.parse(token);
  const accessToken = tokenJson.access_token;
  const tokenType = tokenJson.token_type;

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        console.error("No file selected");
        return;
      }
      setIsUploading(true); // Set uploading to true before starting any requests
      try {
        // 1. Make the API call first (to fetch the response)
        if (profile?.organization_id) {
          const response = await fetch(
            `https://analytics-production-88e7.up.railway.app/api/v1/datasets/datasets?${chatId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-organization-id": profile.organization_id,
                Authorization: `${tokenType} ${accessToken}`,
              },
              body: JSON.stringify({
                s3_path: `s3://growmax-dev-app-assets/analytics/${file.name}`,
                org_id: profile?.organization_id,
                type: "unknown",
              }),
            }
          );

          // Handle response (if needed)
          if (!response.ok) {
            throw new Error("Failed to upload dataset info");
          }
        }

        // 2. Upload file to S3
        const s3Key = await uploadToS3(file, () => {});

        // Call onFileUploaded with the S3 key
        onFileUploaded(s3Key);
      } catch (error) {
        console.log("🚀 ~ error:", error);
        // Handle errors accordingly
        if (error instanceof S3UploadError) {
        } else {
        }
      } finally {
        // Ensure uploading state is false after both tasks are done
        setIsUploading(false);
      }
    },
    [onFileUploaded, setIsUploading]
  );
  return (
    <div className="flex">
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
          {isUploading ? <Loader /> : <Paperclip />}
        </button>
      </Tooltip>
    </div>
  );
}

export default ChatUploadBtn;
