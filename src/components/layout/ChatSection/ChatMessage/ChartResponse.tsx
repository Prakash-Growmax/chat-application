import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import Typewriter from "typewriter-effect";
import SwitchIcon from "./SwitchIcon";
import TableResponse from "./tableResponse";


import { useMediaQuery, useTheme } from "@mui/material";

const cleanSummaryText = (summaryObj) => {
  if (typeof summaryObj !== "object" || summaryObj === null) return [];

  const excludedKeys = ["currency"];

  return Object.entries(summaryObj)
    .filter(([key]) => !excludedKeys.includes(key))
    .map(([key, value]) => ({
      key,
      rawText: `• ${value}`,
    }));
};

const ChartResponse = ({
  data = [],
  layout = {},
  summary = {},

  isTyping = false,
  isAssistant = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const chatBoxRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const [isPlotRendered, setIsPlotRendered] = useState(false);
  const [checked, setChecked] = useState(true);


  const showTyping = isTyping && isAssistant;
  const summaryEntries = cleanSummaryText(summary);
  const [completedEntries, setCompletedEntries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingInProgress, setIsTypingInProgress] = useState(false);

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
    return {
      ...layout,
      width: dimensions.width,
      height: dimensions.height,
      margin: {
        l: isMobile ? 40 : Math.max(30, Math.floor(dimensions.width * 0.08)),
        r: isMobile ? 10 : Math.max(20, Math.floor(dimensions.width * 0.05)),
        t: isMobile ? 30 : Math.max(30, Math.floor(dimensions.height * 0.08)),
        // Increase bottom margin to make room for x-axis labels
        b: isMobile ? 70 : Math.max(60, Math.floor(dimensions.height * 0.15)),
        pad: isMobile ? 2 : 4,
      },
      autosize: true,
      font: {
        size: isMobile ? 10 : Math.max(10, Math.min(14, dimensions.width / 40)),
      },
      xaxis: {
        ...layout.xaxis,
        tickfont: { size: isMobile ? 8 : 11 },
        // Add these properties to fix x-axis label issues
        tickangle: -45,  // Rotate labels for better visibility
        automargin: true // Automatically adjust margins for labels
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
      setDimensions(newDimensions);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current) resizeObserver.unobserve(containerRef.current);
    };
  }, []);

  const handlePlotRender = () => {
    if (!isPlotRendered) {
      setIsPlotRendered(true);
      setShouldStartTyping(true);
      setTimeout(() => {
        chatBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100); // Small delay to ensure UI updates before scrolling
    }
  };
  

  useEffect(() => {
    if (
      showTyping &&
      isPlotRendered &&
      shouldStartTyping &&
      !isTypingInProgress &&
      currentIndex < summaryEntries.length
    ) {
      setIsTypingInProgress(true);
    }
  }, [showTyping, isPlotRendered, shouldStartTyping, isTypingInProgress, currentIndex, summaryEntries.length]);

  const handleTypingComplete = () => {
    if (currentIndex < summaryEntries.length) {
      setCompletedEntries((prev) => [...prev, summaryEntries[currentIndex]]);
      setCurrentIndex((prev) => prev + 1);
      setIsTypingInProgress(false);
    }
  };
  useEffect(() => {
    if (completedEntries.length > 0) {
      chatBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [completedEntries.length]);
  

  useEffect(() => {
    if (!showTyping && summaryEntries.length > 0 && completedEntries.length === 0) {
      setCompletedEntries(summaryEntries);
    }
  }, [showTyping, summaryEntries, completedEntries.length]);

  return (
    <div className="relative w-full flex flex-col items-center flexible-container">
      <div className="absolute top-2 right-2 z-50 -mt-12">
        <SwitchIcon checked={checked} setChecked={setChecked} />
      </div>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flexible-container">
        <div className="flex flex-col w-full py-2 flexible-container">
          <div ref={containerRef} className="relative w-full flex justify-center mb-4 chart-container">
            {checked ? (
              <Plot
                data={data}
                layout={getDynamicLayout(dimensions)}
                onInitialized={handlePlotRender}
                onUpdate={handlePlotRender}
                config={{
                  responsive: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ["zoom2d", "pan2d"],
                  modeBarButtonsToAdd: ["toImage"],
                }}
                className="w-full"
              />
            ) : (
              <TableResponse data={data} layout={layout} />
            )}
          </div>
          <div ref={chatBoxRef} className="prose w-full px-2 sm:px-0 text-container">
  {completedEntries.map((entry, index) => (
    <div key={index} className="mb-2">
      {entry.rawText}
    </div>
  ))}

  {showTyping && isTypingInProgress && currentIndex < summaryEntries.length && (
    <div className="mb-2">
      <Typewriter
        onInit={(typewriter) =>
          typewriter
            .typeString(summaryEntries[currentIndex].rawText) // Typing key and value together
            .callFunction(handleTypingComplete)
            .start()
        }
        options={{ delay:1, cursor: "|" }} // Adjust delay for speed
      />
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default ChartResponse;

