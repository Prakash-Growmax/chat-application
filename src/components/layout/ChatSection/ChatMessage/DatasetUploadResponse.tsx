import Typewriter from "typewriter-effect";
import { MessageCircle, Sheet } from 'lucide-react';
import { useRef, useState } from "react";
import { Message } from "@/types";
import { useChatContext } from "@/context/ChatContext";
import { BodySmall } from "@/Theme/Typography";
import TooltipNew from "@/components/ui/tooltipnew";
import { CSVPreview } from "@/components/CSVPreview/CSVPreview";
import { cleanFilename } from "@/utils/s3.utils";

const DatasetUploadResponse = ({ message,isTyping,isAssistant,onContentChange}) => {

  const { addToQueue, queue, setS3Key, s3Key } = useChatContext();
  const [showHeading, setShowHeading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    onContentChange?.();
  };
  const fileName = cleanFilename(message?.file_path);

  function addUserQueue(value) {
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

  const [showPreview, setShowPreview] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const showTyping = isAssistant && isTyping;
 

  return (
    <div className="flex flex-col m-auto text-base py-2" ref={containerRef}>
      {fileName && (
        <>
          <div
            className="relative flex items-center justify-between bg-gray-100 rounded-lg p-2 mb-2 w-80"
           
          >
            <div className="flex items-center gap-x-2">
              <button
                className="w-[40px] h-[40px] bg-[#10A37F] rounded-lg flex justify-center items-center p-2"
              >
                <Sheet size={30} color="white" />
              </button>
              <span className="text-base font-semibold">{`${fileName}`}</span>
            </div>
            {showPreview && (
              <div>
                <TooltipNew title="Preview CSV" placement="top-start">
                  <CSVPreview s3Key={`s3://growmax-dev-app-assets/analytics/${fileName}`} />
                </TooltipNew>
              </div>
            )}
          </div>
        </>
      )}
     {showTyping ? (<>
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
            deleteSpeed: null,
            loop: false,
          }}
        />
      </div>
     </>):(<>
      <div className="mb-3">
        <p>{message?.text}</p>
      </div>
     </>)}
    

      {message?.suggested_questions && (
        <>
        {showTyping ? (<>
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
                    deleteSpeed: null,
                    loop: false,
                  }}
                />
              </div>
            )}
          </div>
        </>) : (<>
          <div className="text-base font-bold">
            <p>{"Suggested Questions"}</p>
            </div>
        </>)}
         
        {showTyping ? (
  <div className="flex flex-col gap-3">
    {message?.suggested_questions?.map((question, index) => 
      index <= currentQuestionIndex && (
        <TooltipNew key={index} title="Click to ask a query" placement="top-start">
          <div
            className="flex space-x-2 items-center border border-gray-200 rounded-md p-2 cursor-pointer"
            onClick={() => addUserQueue(question)}
          >
            <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
            <BodySmall>
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString(question)
                    .callFunction(() => {
                      if (index < message?.suggested_questions.length - 1) {
                        setCurrentQuestionIndex(index + 1);
                      }
                      scrollToBottom();
                    })
                    .start();
                }}
                options={{
                  delay: 0.01,
                  cursor: '',
                  deleteSpeed: null,
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
    {message?.suggested_questions?.map((question, index) =>(
        <TooltipNew key={index} title="Click to ask a query" placement="top-start">
          <div
            className="flex space-x-2 items-center border border-gray-200 rounded-md p-2 cursor-pointer"
            onClick={() => addUserQueue(question)}
          >
            <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
            <BodySmall>{question}</BodySmall>
          </div>
        </TooltipNew>
      )
    )}
  </div>
)}

        
        </>
      )}
    </div>
  );
};

export default DatasetUploadResponse;
