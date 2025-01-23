import LogoIcon from "@/assets/Logo/LogoIcon";

function ChatAssistantHeader({
  isGenerating = false,
}: {
  isGenerating?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="rounded-full pt-2">
        <LogoIcon width="24px" height="24px" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">
          Ansight Assistant
        </span>
        {isGenerating && (
          <span className="text-xs text-gray-500">Generating response...</span>
        )}
      </div>
    </div>
  );
}

export default ChatAssistantHeader;
