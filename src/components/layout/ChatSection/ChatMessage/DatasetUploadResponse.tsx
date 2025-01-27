import Typewriter from "typewriter-effect";
import { MessageCircle } from 'lucide-react';
import { useState } from "react";
const DatasetUploadResponse = ({ message }) => {
  const [showHeading, setShowHeading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  return (
    <div className="flex flex-col m-auto text-base py-2">
      <div className="mb-1">
      <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString(message?.text || '')
              .callFunction(() => setShowHeading(true))
              .start();
          }}
          options={{
            delay: 50,
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
                .callFunction(() => setCurrentQuestionIndex(0))
                .start();
            }}
            options={{
              delay: 50,
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
              <div  key={index}
              className="flex space-x-2 items-center border border-gray-200 rounded-md p-2">
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
                        })
                        .start();
                    }}
                    options={{
                      delay: 50,
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
