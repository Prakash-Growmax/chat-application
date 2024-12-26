import { S3UploadError, UploadProgress, uploadToS3 } from "@/lib/s3-client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { Send, Upload } from "lucide-react";
import { Tooltip } from "@mui/material";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CSVPreview } from "../CSVPreview/CSVPreview";
import Spinner from "../ui/Spinner";


interface ChatInputProps {
    onSend: (message: string) => void;
    disabled: boolean;
    onFileUploaded: (s3Key: string) => void;
    onError: (error: string) => void;
    isUploading:boolean;
    setIsUploading:(state:boolean)=>void
    s3Key:string
    bucket:string
  }
export function ChatInput({ onSend, disabled, onFileUploaded, onError,isUploading,setIsUploading,s3Key,bucket}: ChatInputProps) {
    const [input, setInput] = useState("");
    const [rows, setRows] = useState(1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
  
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
        setRows(1);
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
      <>
       <motion.form
        onSubmit={handleSubmit}
        className="flex sticky max-w-8xl items-center justify-center gap-2 p-4 bg-white shadow-md hover:shadow-lg rounded-lg border border-gray-300 min-h-40 lg:w-[70%] md:w-[70%] w-[90%]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col w-full">
          {s3Key && (
                      <div>
                        <CSVPreview
                          s3Key={s3Key || ""}
                          bucket={import.meta.env.VITE_S3_BUCKET_NAME}
                        />
                      </div>
                    )}
                      <div className="relative flex items-center justify-content flex-1 mb-6">
          <div className="relative flex-1">
            <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2">
             {isUploading ? (
              <Spinner/>
             ):(
              <>
                <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
                disabled={isUploading}
              />
              <Tooltip title="Upload">
              <Upload
                size={24}
                // color="#3B82F6"
                className="cursor-pointer text-blue-700 hover:bg-gray-200 active:bg-gray-300 w-8 h-8 p-1 rounded-full"
                onClick={() => document.getElementById("csv-upload")?.click()}
              />
              </Tooltip>
           
              </>
             )}
          
            </div>
  
            <Textarea
    ref={textareaRef}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="Enter your question"
    className="flex-1 h-[60px] rounded-3xl border border-blue-500 pt-[15px] pb-[10px] pr-12 pl-12 pl-[70px] hover:border-blue-500 focus:border-blue-500 resize-none placeholder:pl-[5px] placeholder:font-semibold lg:placeholder:text-base placeholder:text-sm leading-[1.5] text-base"
    rows={1} // Use a fixed row size for large screens
  />
  
  
          </div>
          <Button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 ml-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
          </div>
        
      
      </motion.form>
      </>
     
    );
  }