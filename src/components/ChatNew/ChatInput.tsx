import { S3UploadError, UploadProgress, uploadToS3 } from "@/lib/s3-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CSVPreview } from "../CSVPreview/CSVPreview";
import Spinner from "../ui/Spinner";
import AttachIcon from "../ui/attach-ui";
import { AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

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
  disabled,
  onFileUploaded,
  onError,
  isUploading,
  setIsUploading,
  s3Key,
  bucket,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const adjustTextareaHeight = useCallback(() => {
    console.log("hi");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setFileName(file.name);
      setIsUploading(true);
      setError(null);

      try {
        const s3Key = await uploadToS3(file, (progress) => {
          setUploadProgress(progress);
        });
        onFileUploaded(s3Key);
      } catch (error) {
        if (error instanceof S3UploadError) {
          setError(error.message);
          onError(error.message);
        } else {
          setError("An unexpected error occurred");
          onError("An unexpected error occurred");
        }
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
      }
    },
    [onFileUploaded, onError]
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

  // Calculate dynamic heights based on s3Key
  const minContainerHeight = s3Key ? "min-h-24" : "min-h-40";
  const footerHeight = s3Key ? "h-10" : "h-14";
  const textareaPaddingBottom = s3Key ? "pb-12" : "pb-14";

  return (
    <div className="flex flex-col w-full border border-gray-100">
      <div className="relative flex-1 flex items-center justify-center">
        <div className={`relative w-full max-w-8xl lg:w-[60%] md:w-[80%] w-[90%] ${minContainerHeight}`}>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message G-Chat"
            className={`w-full rounded-2xl py-4 px-8 resize-none placeholder:font-semibold leading-[1.5] text-base transition-all bg-white shadow-md ${textareaPaddingBottom}`}
            style={{
              border: "1px solid #e0e0e0",
              outline: "none",
              boxShadow: "none",
              minHeight: s3Key ? "96px" : "160px",
              maxHeight: s3Key ? "120px" : "600px",
              overflowY: "auto"
            }}
          />
          
          <div className={`absolute bottom-0 left-0 right-0 ${footerHeight} bg-white shadow-md border-b border-l border-r rounded-tl-none rounded-tr-none rounded-2xl`}>
            <div className="flex justify-between items-center px-3 h-full">
              <div className="flex items-center gap-2">
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
                    {isUploading ? <Spinner /> : <AttachIcon />}
                  </button>
                </Tooltip>
                
                {s3Key && (
                  <div>
                    <Tooltip title="Preview CSV">
                      <CSVPreview 
                        s3Key={s3Key} 
                        bucket={bucket}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {input.trim() && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      type="submit"
                      className="flex items-center gap-2 bg-black hover:bg-blue-600 rounded-full p-2"
                      disabled={isSubmitting || !input.trim()}
                      onClick={handleSubmit}
                    >
                      <ArrowUp className="h-8 w-5" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}