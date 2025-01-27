import { Caption } from "@/Theme/Typography";
import { formatTimestamp } from "@/utils/general.utilis";

function ChatTimeStamp({
  timeStamp = "",
  isHovering,
}: {
  timeStamp: string;
  isHovering: boolean;
}) {
  return (
    <Caption
      className={`flex items-center justify-end mr-4   
                  transition-opacity 
            ${isHovering ? "opacity-100" : "opacity-0"}
              whitespace-nowrap
        `}
    >
      {formatTimestamp(timeStamp)}
    </Caption>
  );
}

export default ChatTimeStamp;
