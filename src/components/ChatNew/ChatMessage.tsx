import { Message } from "@/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

import PaperCard from "../Custom-UI/PaperCard";
import ChartResponse from "../layout/ChatSection/ChatMessage/ChartResponse";
import DatasetUploadResponse from "../layout/ChatSection/ChatMessage/DatasetUploadResponse";
import InsighttResponse from "../layout/ChatSection/ChatMessage/InsightResponse";
import TextResponse from "../layout/ChatSection/ChatMessage/TextResponse";
import { Dialog, DialogContent } from "../ui/dialog";
import SwitchButton from "../ui/Switchbutton";
import ChatAssistantHeader from "./ChatMessage/ChatAssistantHeader";
import ChatTypeInfo from "./ChatMessage/ChatTypeInfo";
import { DataChart } from "./DataChat";
import DataTable from "./DataTable";
interface ChatMessageProps {
  message: Message;
}
export function ChatMessage({ message }: ChatMessageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isUser = message.role === "user";
  //   const data = message.messageObject.content.data
  // const layout = message.messageObject.content.layout
  return (
    <>
      <div className="mx-auto max-w-4xl h-full">
        {isUser ? (
          <div className="flex w-full items-center justify-center py-2">
            <PaperCard className="w-full border-none rounded-3xl p-3">
              <ChatTypeInfo isUser={isUser} />
              <RenderContent message={message} isAssistant={!isUser} />
            </PaperCard>
          </div>
        ) : (
          <div className="flex w-full items-center justify-center py-2">
            <PaperCard className="w-full border-none rounded-3xl p-3">
              <ChatAssistantHeader />
              <RenderContent message={message} />
            </PaperCard>
          </div>
        )}
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] overflow-auto">
          {message.type === "chart" && <DataChart data={message.data} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

const RenderContent = ({
  message,
  isAssistant = false,
}: {
  message: Message;
  isAssistant?: boolean;
}) => {
  if (message.type === "text") {
    return <TextResponse message={message} isAssistant={isAssistant} />;
  }
  if (message?.messageObject?.content?.type === "text") {
    return (
      <DatasetUploadResponse
        message={message?.messageObject?.content?.data?.response}
      />
    );
  }
  // if (message?.type === "chart") {
  //   return <ChartTableResponse message={message} />;
  // }
  if (message?.messageObject?.content?.type === "insights") {
    return <InsighttResponse data={message.messageObject.content.data} />;
  }
  if (message?.messageObject?.content?.type === "bar") {
    return (
      <ChartResponse
        data={message.messageObject.content.data}
        layout={message.messageObject.content.layout}
        summary={message.messageObject.content.summary}
      />
    );
  }
};

const ChartTableResponse = ({ message }) => {
  const [isChecked, setIsChecked] = useState(false);

  const [layoutDimensions, setLayoutDimensions] = useState({
    width: 500,
    height: 350,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayoutDimensions({ width: 280, height: 450 });
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        // Mid-screen dimensions
        setLayoutDimensions({ width: 700, height: 350 });
      } else {
        // Larger screen dimensions
        setLayoutDimensions({ width: 835, height: 400 });
      }
    };

    // Set initial dimensions
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, transform: "scale(0.95)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={{ duration: 0.5 }}
      className="relative px-4"
    >
      <div
        className={`flex flex-col lg:w-[835px] lg:h-[500px] md:w-[700px] w-[300px] md:h-[480px]  max-w-full `}
      >
        <div className={`flex justify-end mb-2 `}>
          <SwitchButton isChecked={isChecked} setIsChecked={setIsChecked} />
        </div>
        <div>
          {isChecked ? (
            <>
              <Plot
                data={data}
                layout={layout}
                config={{
                  responsive: true,
                  displaylogo: false, // Remove Plotly logo
                  modeBarButtonsToRemove: [
                    "zoom2d", // Removes zoom functionality
                    "pan2d", // Removes pan functionality
                    "select2d",
                    "lasso2d",
                    "hoverClosestCartesian",
                    "hoverCompareCartesian",
                    "toggleSpikelines",
                    "autoScale2d",
                    "resetScale2d",
                  ],
                  modeBarButtonsToAdd: ["toImage"],
                }}
              />
            </>
          ) : (
            <div>
              <DataTable />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
