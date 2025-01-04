import { S3UploadError, uploadToS3 } from "@/lib/s3-client";
import { Tooltip } from "@mui/material";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Spinner from "../ui/Spinner";
import AttachIcon from "../ui/attach-ui";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  onFileUploaded: (s3Key: string) => void;
  onError: (error: string) => void;
  isUploading: boolean;
  setIsUploading: (state: boolean) => void;
  s3Key: string;
  bucket: string;
}

export function ChatInput({
  onSend,
  onFileUploaded,
  onError,
  isUploading,
  setIsUploading,
  s3Key,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const maxHeight = s3Key ? 120 : 200;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [s3Key]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight, s3Key]);

  useEffect(() => {
    if (s3Key) {
      containerRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [s3Key]);

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
        onFileUploaded(s3Key);
      } catch (error) {
        if (error instanceof S3UploadError) {
          onError(error.message);
        } else {
          onError("An unexpected error occurred");
        }
      } finally {
        setIsUploading(false);
      }
    },
    [onFileUploaded, onError, setIsUploading]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSubmitting) {
      setIsSubmitting(true);
      onSend(input.trim());
      setInput("");
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <form className="w-full" onSubmit={handleSubmit} ref={containerRef}>
          <div className="relative flex h-full max-w-full flex-1 flex-col">
            <div className="group relative flex w-full items-center">
              <div className="w-full">
                <div
                  id="composer-background"
                  className="flex w-full cursor-text flex-col rounded-3xl px-2.5 py-1 transition-colors shadow-lg"
                >
                  <div className="flex min-h-[44px] items-start pl-2">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        adjustTextareaHeight();
                      }}
                      placeholder="Message Ansight..."
                      className="block h-10 w-full resize-none border-0 bg-transparent px-0 py-2 text-base text-token-text-primary placeholder:text-gray-500 focus:outline-none"
                      onKeyDown={handleKeyDown}
                    />
                  </div>

                  <div className="flex h-[44px] items-center justify-between">
                    <div className="flex gap-x-1">
                      {/* Attachment button */}
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
                          onClick={() =>
                            document.getElementById("csv-upload")?.click()
                          }
                        >
                          {isUploading ? <Spinner /> : <AttachIcon />}
                        </button>
                      </Tooltip>
                    </div>

                    <button
                      type="submit"
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        input
                          ? "bg-black text-white hover:opacity-70"
                          : "bg-[#D7D7D7] text-[#f4f4f4]"
                      }`}
                    >
                      <ArrowUp size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
