import Typewriter from "typewriter-effect";
import { MessageCircle } from 'lucide-react';
import { useRef, useState } from "react";
import { Message } from "@/types";
import { useChatContext } from "@/context/ChatContext";
const DatasetUploadResponse = ({ message, onContentChange }) => {
  const { addToQueue, queue } = useChatContext();
  const [showHeading, setShowHeading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const containerRef = useRef(null);

  // Scroll to bottom whenever content changes
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    onContentChange?.();
  };

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

  return (
    <div className="flex flex-col m-auto text-base py-2" ref={containerRef}>
      <div className="mb-1">
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
            delay: 20,
            cursor: '',
            deleteSpeed: null,
            loop: false
          }}
        />
      </div>
      <div className="mb-1">
        {showHeading && (
          <div className="text-base font-bold">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString('Frequently Asked Questions')
                  .callFunction(() => {
                    setCurrentQuestionIndex(0);
                    scrollToBottom();
                  })
                  .start();
              }}
              options={{
                delay: 20,
                cursor: '',
                deleteSpeed: null,
                loop: false
              }}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {message?.suggested_questions?.map((question, index) => (
          <>
            {index <= currentQuestionIndex && (
              <div
                key={index}
                className="flex space-x-2 items-center border border-gray-200 rounded-md p-2 cursor-pointer"
                onClick={() => { addUserQueue(question) }}
              >
                <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                <div className="flex-1">
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
                      delay: 20,
                      cursor: '',
                      deleteSpeed: null,
                      loop: false
                    }}
                  />
                </div>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};
export default DatasetUploadResponse;
