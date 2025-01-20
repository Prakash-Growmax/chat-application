import { useChatContext } from "@/context/ChatContext";
import { useProfile } from "@/hooks/profile/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { chatService } from "@/services/ChatService";
import { Message } from "@/types";
import { getAccessToken, getChatId, tokenType } from "@/utils/storage.utils";
import { Tooltip } from "@mui/material";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CSVPreview } from "../CSVPreview/CSVPreview";
import ChatUploadBtn from "../layout/ChatSection/ChatUpload/ChatUploadBtn";

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

export function ChatInput({ onFileUploaded, s3Key, bucket }: ChatInputProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { addToQueue, processing, queue, processQueue } = useChatContext();
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const maxHeight = s3Key ? 120 : 200;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [s3Key]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;

    setInput("");

    const userMessage: Message = {
      id: Date.now().toString(),
      content: value,
      role: "user",
      timestamp: new Date(),
      type: "text",
      isTyping: false,
    };
    addToQueue(userMessage);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  const processMessage = async (message: Message) => {
    try {
      if (queue[queue.length - 1]?.role !== "user") return; // Add this check
      if (profile?.organization_id && user?.id) {
        const chatId = getChatId() || "";
        const org_id = profile.organization_id;

        const result = await chatService.analyzeQuery(
          chatId,
          {
            org_id,
            query: message.content, // Use message content instead of input
            user_id: user?.id,
            chat_id: chatId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-organization-id": org_id,
              Authorization: `${tokenType} ${getAccessToken()}`,
            },
          }
        );
        if (result?.data?.error) {
          throw new Error(result?.data?.error);
        }

        const assistantMessage: Message = {
          id: Date.now().toString(),
          content: result?.data?.response || "",
          role: "assistant",
          timestamp: new Date(),
          type: "text",
          isTyping: false,
        };
        addToQueue(assistantMessage);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: error?.message || "Facing some issues",
        role: "assistant",
        timestamp: new Date(),
        type: "text",
        isTyping: false,
      };
      addToQueue(errorMessage);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (!processing && queue.length > 0 && mounted) {
      processQueue(processMessage);
    }

    return () => {
      mounted = false;
    };
  }, [processing, processQueue]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight, s3Key]);

  useEffect(() => {
    if (s3Key) {
      containerRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [s3Key]);

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <form className="w-full" onSubmit={handleSubmit} ref={containerRef}>
          <div className="relative flex h-full max-w-full flex-1 flex-col">
            <div className="group relative flex w-full items-center">
              <div className="w-full">
                <div
                  id="composer-background"
                  className="flex w-full cursor-text flex-col rounded-3xl px-2.5 py-1 transition-colors shadow-[0_2px_4px_rgba(0,0,0,0.1),0_-1px_2px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex min-h-[44px] items-start pl-2">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        adjustTextareaHeight();
                      }}
                      placeholder="Attach a file to kick off the conversation..."
                      className="block h-10 w-full resize-none border-0 bg-transparent px-0 py-2 text-base text-token-text-primary placeholder:text-gray-500 focus:outline-none"
                      onKeyDown={handleKeyDown}
                    />
                  </div>

                  <div className="flex h-[44px] items-center justify-between">
                    <div className="flex gap-x-1">
                      <ChatUploadBtn onFileUploaded={onFileUploaded} />

                      {s3Key && (
                        <div>
                          <Tooltip title="Preview CSV">
                            <CSVPreview s3Key={s3Key} bucket={bucket} />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    {/* Attachment button */}

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
