import { ChatInput } from "@/components/ChatNew/ChatInput";
import ChatStarterText from "@/components/layout/ChatSection/ChatStarterText";

function NewChat() {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <ChatStarterText />

        <div className="w-full max-w-4xl px-2 sm:px-4 mx-auto">
          <ChatInput
          // onFileUploaded={(key) => {
          //   setState({
          //     ...state,
          //     s3Key: key,
          //     messages: [
          //       {
          //         id: Date.now().toString(),
          //         content:
          //           'CSV data loaded successfully! Try asking me questions about the data. Type "help" to see what I can do.',
          //         role: "assistant",
          //         timestamp: new Date(),
          //         type: "text",
          //         isTyping: false,
          //       },
          //     ],
          //   });
          // }}
          />
        </div>
      </div>

      <div className="px-2 pb-2 text-center">
        <div className="text-xs text-gray-500">
          Ansight can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
}

export default NewChat;
