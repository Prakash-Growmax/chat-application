import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import Typewriter from "typewriter-effect";
import SwitchIcon from "./SwitchIcon";
import TableResponse from "./tableResponse";
import { BodySmall, ListItemHeaderText } from "@/Theme/Typography";
import TooltipNew from "@/components/ui/tooltipnew";
import { MessageCircle } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { toast } from "sonner";
import { useMediaQuery, useTheme } from "@mui/material";

const cleanSummaryText = (summaryObj) => {
  if (typeof summaryObj !== "object" || summaryObj === null) return [];

  // List of keys to exclude
  const excludedKeys = ["currency","trend"];

  return Object.entries(summaryObj)
    .filter(([key]) => !excludedKeys.includes(key)) // Exclude unwanted keys
    .map(([key, value]) => ({
      key,
      content: key === "recommendation" ? (
        // Special UI for recommendation
        <div className="w-full gap-2">
          <strong>Suggested Question:</strong>{" "}
          <TooltipNew title="Click to ask a query" placement="top-start">
            <div className="flex space-x-2 items-center border border-gray-200 rounded-md p-2 cursor-pointer mb-2">
              <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
              <BodySmall>{value}</BodySmall>
            </div>
          </TooltipNew>
        </div>
      ) : (
        // Normal UI for other keys
        <div>
          <strong>{key.replace(/_/g, " ")}:</strong> {value}
        </div>
      ),
      rawText: `${key.replace(/_/g, " ")}: ${value}`
    }));
};

const ChartResponse = ({
  data = [],
  layout = {},
  summary = {},
  onContentChange,
  isTyping = false,
  isAssistant = false,
}) => {
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedEntries, setCompletedEntries] = useState([]);
  const [isTypingInProgress, setIsTypingInProgress] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const chatBoxRef = useRef(null);
  const [isPlotRendered, setIsPlotRendered] = useState(false);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const [checked, setChecked] = useState(true);
    const {queue,analyze,addToQueue} = useChatContext();
  const showTyping = isTyping && isAssistant;
  const summaryEntries = cleanSummaryText(summary);

  const calculateDimensions = () => {
    if (!containerRef.current) return { width: 0, height: 0 };
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const containerWidth = containerRef.current.offsetWidth;
    const isMobile = viewportWidth < 640;
    const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

    let width = containerWidth;
    let height;

    if (isMobile) {
      width = Math.min(containerWidth, viewportWidth - 32);
      height = viewportHeight * 0.4;
    } else if (isTablet) {
      width = Math.min(containerWidth, viewportWidth * 0.85);
      height = width * 0.75;
    } else {
      width = Math.min(containerWidth, viewportWidth * 0.75);
      height = width * 0.6;
    }

    width = Math.max(width, 280);
    height = Math.max(height, 250);
    height = Math.min(height, viewportHeight * 0.7);

    return { width, height };
  };

  const getDynamicLayout = (dimensions) => {
    const isMobile = window.innerWidth < 640;

    return {
      ...layout,
      width: dimensions.width,
      height: dimensions.height,
      margin: {
        l: isMobile ? 40 : Math.max(30, Math.floor(dimensions.width * 0.08)),
        r: isMobile ? 10 : Math.max(20, Math.floor(dimensions.width * 0.05)),
        t: isMobile ? 30 : Math.max(30, Math.floor(dimensions.height * 0.08)),
        b: isMobile ? 50 : Math.max(30, Math.floor(dimensions.height * 0.08)),
        pad: isMobile ? 2 : 4,
      },
      autosize: true,
      font: {
        size: isMobile ? 10 : Math.max(10, Math.min(14, dimensions.width / 40)),
      },
      xaxis: {
        ...layout.xaxis,
        tickangle: isMobile ? -45 : 0,
        tickfont: { size: isMobile ? 6 : 11 },
      },
      yaxis: {
        ...layout.yaxis,
        tickfont: { size: isMobile ? 6 : 11 },
      },
    };
  };

  useEffect(() => {
    const handleResize = () => {
      const newDimensions = calculateDimensions();
      if (newDimensions) {
        setDimensions(newDimensions);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const handlePlotRender = () => {
    if (!isPlotRendered) {
      setIsPlotRendered(true);
      setShouldStartTyping(true);
    }
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Start typing when the plot is rendered
  useEffect(() => {
    if (showTyping && isPlotRendered && shouldStartTyping && !isTypingInProgress && currentIndex < summaryEntries.length) {
      setIsTypingInProgress(true);
    }
  }, [showTyping, isPlotRendered, shouldStartTyping, isTypingInProgress, currentIndex, summaryEntries.length]);

  // Handle typing completion for current entry
  const handleTypingComplete = () => {
    if (currentIndex < summaryEntries.length) {
      setCompletedEntries(prev => [...prev, summaryEntries[currentIndex]]);
      setCurrentIndex(prev => prev + 1);
      setIsTypingInProgress(false);
      
      // Trigger content change and scroll
      if (onContentChange) {
        onContentChange();
      }
      
      setTimeout(scrollToBottom, 100);
    } else {
      setIsTypingComplete(true);
    }
  };

  // For non-typing mode, show all entries at once
  useEffect(() => {
    if (!showTyping && summaryEntries.length > 0 && completedEntries.length === 0) {
      setCompletedEntries(summaryEntries);
      setIsTypingComplete(true);
    }
  }, [showTyping, summaryEntries, completedEntries.length]);
  function addUserQueue(value: string) {
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
  const handleQueueMessage=(question:string)=>{
    console.log(question)
    if(!analyze){
      addUserQueue(question)
    }
    else{
  
      toast("Please wait while we process your query", {
        position: (isMobile || isTab) ? "top-center" : "bottom-center", // Display at the top for mobile, bottom for others
      });
    }
  }

  return (
    <div className="relative w-full flex flex-col items-center flexible-container">
      <div className="absolute top-2 right-2 z-50 -mt-12">
        <SwitchIcon checked={checked} setChecked={setChecked} />
      </div>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flexible-container">
        <div className="flex flex-col w-full py-2 flexible-container">
          <div ref={containerRef} className="relative w-full flex justify-center mb-4 chart-container">
            {checked ? (
              <div className="w-full">
                <Plot
                  data={data}
                  layout={getDynamicLayout(dimensions)}
                  onInitialized={handlePlotRender}
                  onUpdate={handlePlotRender}
                  config={{
                    responsive: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: [
                      "zoom2d",
                      "pan2d",
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
                  className="w-full"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full overflow-x-auto">
                <ListItemHeaderText className="flex justify-center items-center mb-2">
                  {layout?.title?.text}
                </ListItemHeaderText>
                <TableResponse data={data} layout={layout} />
              </div>
            )}
          </div>
          <div ref={chatBoxRef} className="prose w-full max-w-none px-2 sm:px-0 text-container">
            {/* Completed entries */}
            {completedEntries.map((entry, index) => (
              <div key={`completed-${index}`} className="mb-2">
                {entry.content}
              </div>
            ))}
            
            {/* Current typing entry */}
            {showTyping && isTypingInProgress && currentIndex < summaryEntries.length && (
summaryEntries[currentIndex]?.key === "recommendation" ? (
  <div className="w-full flex">
    <strong>Suggested Question:</strong>{" "}
    <TooltipNew title="Click to ask a query" placement="top-start">
      <div className="flex space-x-2 items-center border border-gray-200 rounded-md p-2 cursor-pointer mb-2"  onClick={() => handleQueueMessage(summaryEntries[currentIndex].rawText)}>
        <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
        <BodySmall>
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString(summaryEntries[currentIndex].rawText.split(": ")[1]) // Type only the value
              .callFunction(() => {
                handleTypingComplete();
              })
              .start();
          }}
          options={{
            delay: 1,
            cursor: '|',
          }}
        />
        </BodySmall>
      
      </div>
    </TooltipNew>
  </div>
) : (
  <div className="mb-2 flex">
    <strong>{summaryEntries[currentIndex].key.replace(/_/g, " ")}:</strong>{" "}
    <Typewriter
      onInit={(typewriter) => {
        typewriter
          .typeString(summaryEntries[currentIndex].rawText.split(": ")[1]) // Type only the value
          .callFunction(() => {
            handleTypingComplete();
          })
          .start();
      }}
      options={{
        delay: 1,
        cursor: '|',
      }}
    />
  </div>
)

)}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartResponse;
