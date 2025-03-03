import Typewriter from "typewriter-effect";
import { MessageCircle, Sheet } from 'lucide-react';
import { useContext, useRef, useState } from "react";
import { Message } from "@/types";
import { useChatContext } from "@/context/ChatContext";
import { BodySmall } from "@/Theme/Typography";
import TooltipNew from "@/components/ui/tooltipnew";

import { cleanFilename } from "@/utils/s3.utils";
import { CSVPreviewData, FileMetadata, PreviewError } from "@/lib/types/csv";
import AppContext from "@/components/context/AppContext";
import { fetchCSVPreview } from "@/lib/s3-client";
import { env_BUCKETNAME } from "@/constants/env.constant";
import PreviewModal from "@/components/CSVPreview/PreviewModal";
import { toast } from "sonner";
import { useMediaQuery, useTheme } from "@mui/material";
const DatasetUploadResponse = ({ message, isTyping, isAssistant, onContentChange }: { message: Message; isTyping: boolean; isAssistant: boolean; onContentChange?: () => void }) => {

  const { addToQueue,analyze } = useChatContext();
  const [showHeading, setShowHeading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    onContentChange?.();
  };
  const fileName = cleanFilename(message?.file_path || '');

  function addUserQueue(value: string) {
    const userMessage = {
      id: Date.now().toString(),
      content: value,
      role: "user",
      timestamp: new Date(),
      type: "text",
      isTyping: false,
    };
    addToQueue(userMessage);
  }


  const showTyping = isAssistant && isTyping;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [previewData, setPreviewData] = useState<CSVPreviewData | null>(null);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const { setSideDrawerOpen } = useContext(AppContext);

    const handlePreviewClick = async (s3Key) => {
    

     
    
      try {
        const { data, metadata } = await fetchCSVPreview(env_BUCKETNAME, s3Key);
     
        setPreviewData(data);
        setMetadata(metadata);
        setIsModalOpen(true);
      } catch (err) {
        console.error(err)
      } finally {
       
      }
      setSideDrawerOpen(false);
    };
    const handleQueueMessage=(question:string)=>{
      if(!analyze){
        addUserQueue(question)
      }
      else{
    
        toast("Please wait while we process your query", {
          position: (isMobile || isTab) ? "top-center" : "bottom-center", // Display at the top for mobile, bottom for others
        });
      }
    }

  return (
    <div className="flex flex-col m-auto text-base py-2 w-full max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8" ref={containerRef}>
      {fileName && (
        <>
          <div
            className="relative flex items-center justify-between bg-gray-100 rounded-lg p-2 mb-2 w-full"
            onClick={() => handlePreviewClick(`s3://growmax-dev-app-assets/analytics/${fileName}`)}
          >
          <div
  

>
<TooltipNew title="Click to open file" placement="top-start">
  <div className="flex items-center gap-x-2 flex-wrap">
    <button
      className="w-[40px] h-[40px] bg-[#10A37F] rounded-lg flex justify-center items-center p-2"
    >
      <Sheet size={30} color="white" />
    </button>
    <span className="font-semibold text-xs sm:text-base">{fileName}</span>
  </div>
</TooltipNew>

 
</div>

            {/* {showPreview && (
              <div>
                <TooltipNew title="Preview CSV" placement="top-start">
                  <CSVPreview s3Key={`s3://growmax-dev-app-assets/analytics/${fileName}`} />
                </TooltipNew>
              </div>
            )} */}
              
          </div>
        </>
      )}
      {showTyping ? (
        <>
          <div className="mb-3">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(message?.text || '')
                  .callFunction(() => {
                    setShowHeading(true);
                    scrollToBottom();
                  })
                  .start();
              }}
              options={{
                delay: 0.01, // Faster typing speed
                cursor: '',
                deleteSpeed: 0, // Set to 0 for no deletion speed
                loop: false,
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="mb-3">
            <p>{message?.text}</p>
          </div>
        </>
      )}

      {message?.suggested_questions && (
        <>
          {showTyping ? (
            <>
              <div className="mb-3">
                {showHeading && (
                  <div className="text-base font-bold">
                    <Typewriter
                      onInit={(typewriter) => {
                        typewriter
                          .typeString('Suggested Questions')
                          .callFunction(() => {
                            setCurrentQuestionIndex(0);
                            scrollToBottom();
                          })
                          .start();
                      }}
                      options={{
                        delay: 0.01, // Faster typing speed
                        cursor: '',
                        deleteSpeed: 0, // Set to 0 for no deletion speed
                        loop: false,
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-base font-bold">
                <p>{"Suggested Questions"}</p>
              </div>
            </>
          )}

          {showTyping ? (
            <div className="flex flex-col gap-3 w-full">
              {message?.suggested_questions?.map((question: string, index: number) =>
                index <= currentQuestionIndex && (
                  <TooltipNew key={index} title="Click to ask a query" placement="top-start">
                    <div
                      className="flex space-x-2 items-center border border-gray-200 rounded-md p-2 cursor-pointer"
                      onClick={() => handleQueueMessage(question)}
                    >
                      <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                      <BodySmall>
                        <Typewriter
                          onInit={(typewriter) => {
                            typewriter
                              .typeString(question)
                              .callFunction(() => {
                                if (index < (message?.suggested_questions?.length ?? 0) - 1) {
                                  setCurrentQuestionIndex(index + 1);
                                }
                                scrollToBottom();
                              })
                              .start();
                          }}
                          options={{
                            delay: 0.01,
                            cursor: '',
                            deleteSpeed: 0, // Set to 0 for no deletion speed
                            loop: false,
                          }}
                        />
                      </BodySmall>
                    </div>
                  </TooltipNew>
                )
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {message?.suggested_questions?.map((question: string, index: number) => (
                <TooltipNew key={index} title="Click to ask a query" placement="top-start">
                  <div
                    className="flex space-x-2 items-center border border-gray-200 rounded-md p-2 cursor-pointer"
                    onClick={() => handleQueueMessage(question)}
                  >
                    <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                    <BodySmall>{question}</BodySmall>
                  </div>
                </TooltipNew>
              ))}
            </div>
          )}
        </>
      )}
        {previewData && metadata && (
                    <PreviewModal
                      isOpen={isModalOpen}
                      onClose={() => {
                        setIsModalOpen(false);
                        setSideDrawerOpen(true);
                      }}
                      data={previewData}
                      metadata={metadata}
                    />
                  )}
    </div>
  );
};

export default DatasetUploadResponse;
