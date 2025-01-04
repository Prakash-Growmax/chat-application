import { Message } from "@/types";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Typewriter from "typewriter-effect";

import AppContext from "../context/AppContext";
import PaperCard from "../Custom-UI/PaperCard";
import { Dialog, DialogContent } from "../ui/dialog";
import SwitchButton from "../ui/Switchbutton";
import ChatTypeInfo from "./ChatMessage/ChatTypeInfo";
import { DataChart } from "./DataChat";
import DataTable from "./DataTable";
interface ChatMessageProps {
  message: Message;
  recent: boolean;
  openRight: boolean;
}
export function ChatMessage({ message }: ChatMessageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isUser = message.role === "user";

  return (
    <>
      <div className="mx-auto max-w-5xl h-full">
        {isUser ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex w-full items-center justify-center py-2">
              <PaperCard className="w-full border-none rounded-3xl p-3">
                <ChatTypeInfo isUser={isUser} />
                <RenderContent message={message} />
              </PaperCard>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex w-full items-center justify-center py-2">
              <PaperCard className="w-full border-none rounded-3xl p-3">
                <ChatTypeInfo isUser={isUser} />
                <RenderContent message={message} />
              </PaperCard>
            </div>
          </motion.div>
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

const RenderContent = ({ message }: { message: Message }) => {
  if (message.type === "text") {
    return <TextResponse message={message} />;
  }

  if (message.type === "chart") {
    return <ChartTableResponse message={message} openRight={openRight} />;
  }
};

const TextResponse = ({
  message,
}: {
  message: { content: string; isTyping: boolean };
}) => {
  return (
    <div className={`flex m-auto text-base py-2`}>
      {message.isTyping ? (
        <Typewriter
          options={{
            strings: [message.content],
            autoStart: true,
            delay: 30,
            cursor: "",
          }}
        />
      ) : (
        <ChatTextMessage content={message.content} />
      )}
    </div>
  );
};

const ChartTableResponse = ({
  openRight,
}: {
  message: Message;
  openRight: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const { open } = useContext(AppContext);

  const [layoutDimensions, setLayoutDimensions] = useState({
    width: 500,
    height: 350,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayoutDimensions({ width: 250, height: 300 });
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        // Mid-screen dimensions
        setLayoutDimensions({ width: 400, height: 350 });
      } else {
        // Larger screen dimensions
        setLayoutDimensions({ width: 500, height: 300 });
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
      className="relative"
    >
      <div
        className={`flex flex-col  lg:w-[800px] lg:h-[500px] md:w-[500px] w-[300px] md:h-[480px]  max-w-full ${
          openRight ? "lg:w-[590px] lg:h-[450px]" : ""
        }`}
      >
        <div className={`flex justify-end mb-2 ${open ? "md:mr-40" : ""}`}>
          <SwitchButton isChecked={isChecked} setIsChecked={setIsChecked} />
        </div>
        <div>
          {isChecked ? (
            <>
              <Plot
                data={[
                  {
                    type: "bar",
                    x: ["Product A", "Product B", "Product C"],
                    y: [20, 14, 23],
                    name: "Sales",
                    marker: { color: "rgb(55, 83, 109)" },
                  },
                ]}
                layout={{
                  title: {
                    text: "Sales Data",
                    font: { size: 24 },
                  },
                  xaxis: {
                    title: "Products",
                    showgrid: true,
                    zeroline: true,
                  },
                  yaxis: {
                    title: "Quantity Sold",
                    showgrid: true,
                    zeroline: true,
                  },
                  barmode: "group",
                  width: layoutDimensions.width,
                  height: layoutDimensions.height,
                }}
              />
            </>
          ) : (
            <div className={open ? "md:mr-40" : ""}>
              <DataTable />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ChatTextMessage = ({ content }: { content: string }) => {
  return (
    <p
      className="text-base leading-6 font-normal text-[rgb(13,13,13)] justify-end"
      style={{
        fontFamily:
          'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
      }}
    >
      {content}
    </p>
  );
};
