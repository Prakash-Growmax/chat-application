import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import LucideIcon from "../Custom-UI/LucideIcon";

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
}

export function FileUploadZone({ onFileUpload }: FileUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }

      if (file.type !== "text/csv") {
        toast.error("Only CSV files are supported");
        return;
      }

      setUploading(true);
      setProgress(0);

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setProgress(i);
        }

        onFileUpload(file);
        toast.success("File uploaded successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload file");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <LucideIcon name={"Upload"} className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop your CSV file here"
                : "Drag & drop your CSV file here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse (max 50MB)
            </p>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <LucideIcon name={"File"} className="h-4 w-4" />
            <span className="text-sm">Uploading...</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
}
