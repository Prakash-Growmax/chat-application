import { useChatContext } from '@/context/ChatContext';
import { BodySmall } from '@/Theme/Typography';
import LogoLoader from '../Custom-UI/LogoLoader';

function ChatLoader() {
  const { processing, isUploading, isLoading, prevMessage, s3Key } =
    useChatContext();

  return (
    <>
      {isLoading && prevMessage.length === 0 && !s3Key && (
        <div className="flex flex-col w-full my-4 mx-2">
          <div className="flex-1">
            <div className="flex items-center justify-center">
              <LogoLoader className="w-20 h-20" />
            </div>
          </div>
        </div>
      )}

      {(isUploading || processing) && (
        <div className="flex flex-col w-full my-4 mx-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <LogoLoader />
              <BodySmall>Ansight progressing...</BodySmall>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatLoader;
