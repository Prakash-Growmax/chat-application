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
  console.log(message);
  return (
    <>
      <div className="mx-auto max-w-4xl h-full">
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
    return <ChartTableResponse message={message}  />;
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

const ChartTableResponse = ({ message }) => {
  const [isChecked, setIsChecked] = useState(false);
  const { open } = useContext(AppContext);

  const [layoutDimensions, setLayoutDimensions] = useState({
    width: 500,
    height: 350,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayoutDimensions({ width:280, height: 450 });
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        // Mid-screen dimensions
        setLayoutDimensions({ width: 700, height: 350 });
      } else {
        // Larger screen dimensions
        setLayoutDimensions({ width: 800, height: 400 });
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
        className={`flex flex-col lg:w-[800px] lg:h-[500px] md:w-[700px] w-[300px] md:h-[480px]  max-w-full `}
      >
        <div className={`flex justify-end mb-2 `}>
          <SwitchButton isChecked={isChecked} setIsChecked={setIsChecked} />
        </div>
        <div>
          {isChecked ? (
            <>
           <Plot
  data={[
    {
      type: "bar",
      x: [
        "Raja Gold Cooking Oil",
        "Rin Soap",
        "Marie Gold",
        "Milk Bikis",
        "Surf Excel Soap",
        "MR Gold Sunflower Oil",
        "Urad Dal",
        "Stayfree Secure XL",
        "Fortune Chakki Atta"
      ],
      y: [120, 90, 80, 70, 150, 200, 50, 60, 140], // Replace with actual revenue numbers
      marker: {
        color: "rgba(55, 128, 191, 0.7)",
        line: {
          color: "rgba(55, 128, 191, 1.0)",
          width: 2
        }
      }
    }
  ]}
  layout={{
    title: {
      text: "Revenue by Product",
      font: {
        size: 14
      }
    },
    xaxis: {
      title: "Product Name",
      tickangle: -45,
      automargin: true
    },
    yaxis: {
      title: "Revenue"
    },
    margin: {
      b: 100
    },
    "height": layoutDimensions.height,
    "width":layoutDimensions.width
  }}
    config={{
    displaylogo: false, // Remove Plotly logo
    modeBarButtonsToRemove: [
      "zoom2d",        // Removes zoom functionality
      "pan2d",         // Removes pan functionality
      "select2d", 
      "lasso2d", 
      "hoverClosestCartesian", 
      "hoverCompareCartesian", 
      "toggleSpikelines", 
      "autoScale2d", 
      "resetScale2d",
    ],
    modeBarButtonsToAdd: ["toImage"], // Keep only the screenshot option
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
