import { useChatContext } from "@/context/ChatContext";
import { BodySmall } from "@/Theme/Typography";
import LogoLoader from "../Custom-UI/LogoLoader";


function ChatLoader() {
  const { processing, isUploading,isLoading,prevMessage,s3Key} = useChatContext();
  return (
    <>
      {/* {processing && (
        <PaperCard className="w-full border-none rounded-3xl p-3">
          <ChatAssistantHeader />

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2">
              <div className="h-2 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse"></div>
              <div className="h-2 w-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.2s]"></div>
              <div className="h-2 w-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              <div className="h-2 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.6s]"></div>
              <div className="h-2 w-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.8s]"></div>
              <div className="h-2 w-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.9s]"></div>
            </div>

            <div className="flex gap-2">
              <div className="h-2 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.1s]"></div>
              <div className="h-2 w-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.2s]"></div>
              <div className="h-2 w-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.3s]"></div>
              <div className="h-2 w-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.4s]"></div>
            </div>

            <div className="flex gap-2">
              <div className="h-2 w-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.2s]"></div>
              <div className="h-2 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              <div className="h-2 w-28 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full animate-pulse [animation-delay:0.6s]"></div>
            </div>
          </div>
        </PaperCard>
      )} */}
      {(isLoading && prevMessage.length === 0 && !s3Key) && (<>   <div className="flex flex-col w-full my-4 mx-2">
            <div className="flex-1">
              <div className="flex items-center justify-center">
              <LogoLoader className="w-20 h-20" />

                
              </div>
            </div>
          </div></>)}
      
      {(isUploading || processing) && (
        <>
          <div className="flex flex-col w-full my-4 mx-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <LogoLoader />
                <BodySmall>Ansight progressing...</BodySmall>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ChatLoader;
