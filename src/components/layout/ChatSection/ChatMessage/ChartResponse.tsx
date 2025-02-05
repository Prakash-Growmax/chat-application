import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import Typewriter from "typewriter-effect";

const formatSummary = (text) => {
  let cleanText = text
    .replace(/\*\*/g, "")
    .replace(/\n\s*\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  const lines = cleanText.split("\n");

  const formattedLines = lines
    .map((line) => {
      let cleanLine = line.replace(/^[-•*]\s*/, "").trim();
      if (/^\d+\./.test(line)) {
        return line;
      }
      if (cleanLine && !/^\d+\./.test(line)) {
        return `• ${cleanLine}`;
      }
      return line;
    })
    .filter((line) => line.trim());

  const cleanedFormattedLines = formattedLines.map((line) =>
    line.replace(/^###\s*/, "")
  );

  return cleanedFormattedLines.join("\n");
};

const ChartResponse = ({ data, layout, summary, onContentChange, isTyping, isAssistant }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedEntries, setCompletedEntries] = useState([]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const chatBoxRef = useRef(null);
  const [isPlotRendered, setIsPlotRendered] = useState(false);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [shouldStartTyping, setShouldStartTyping] = useState(false);

  const formattedSummary = formatSummary(summary);
  const entries = formattedSummary.split("\n");
  const showTyping = isTyping && isAssistant;

  const calculateDimensions = () => {
    if (!containerRef.current) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const containerWidth = containerRef.current.offsetWidth;

    const isMobile = viewportWidth < 640;
    const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

    let width = containerWidth;
    if (isMobile) {
      width = Math.min(containerWidth, viewportWidth * 0.95);
    } else if (isTablet) {
      width = Math.min(containerWidth, viewportWidth * 0.85);
    } else {
      width = Math.min(containerWidth, viewportWidth * 0.75);
    }

    let height;
    if (isMobile) {
      height = width;
    } else if (isTablet) {
      height = width * 0.75;
    } else {
      height = width * 0.6;
    }

    width = Math.max(width, 280);
    height = Math.max(height, 250);
    height = Math.min(height, viewportHeight * 0.7);

    return { width, height };
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

  const dynamicLayout = {
    ...layout,
    width: dimensions.width,
    height: dimensions.height,
    margin: {
      l: Math.max(30, Math.floor(dimensions.width * 0.08)),
      r: Math.max(20, Math.floor(dimensions.width * 0.05)),
      t: Math.max(30, Math.floor(dimensions.height * 0.08)),
      b: Math.max(30, Math.floor(dimensions.height * 0.08)),
      pad: 4,
    },
    autosize: true,
    font: {
      size: Math.max(10, Math.min(14, dimensions.width / 40)),
    },
  };

  const handlePlotRender = () => {
    if (!isPlotRendered) {
      setIsPlotRendered(true);
      setTimeout(() => {
        setShouldStartTyping(true);
      }, 500);
    }
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      const scrollOptions = {
        top: chatBoxRef.current.scrollHeight,
        behavior: 'smooth'
      };
      chatBoxRef.current.scrollTo(scrollOptions);
    }
  };

  useEffect(() => {
    if (showTyping && isPlotRendered && shouldStartTyping && currentIndex < entries.length) {
      const timer = setTimeout(() => {
        setCompletedEntries((prev) => {
          const newEntries = [...prev, entries[currentIndex]];
          setTimeout(scrollToBottom, 100);
          return newEntries;
        });
        setCurrentIndex((prevIndex) => prevIndex + 1);
        onContentChange?.();
      }, 1000);

      return () => clearTimeout(timer);
    } else if (!showTyping && completedEntries.length === 0) {
      setCompletedEntries(entries);
      setIsTypingComplete(true);
    }
  }, [currentIndex, entries, isPlotRendered, shouldStartTyping, onContentChange, showTyping]);

  useEffect(() => {
    if (completedEntries.length > 0) {
      scrollToBottom();
    }
  }, [completedEntries]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="chatBox w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="chatMessage flex flex-col w-full py-2">
          <div ref={containerRef} className="relative w-full flex justify-center mb-4">
            <div className="w-full">
              <Plot
                data={data}
                layout={dynamicLayout}
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
          </div>

          <div 
            ref={chatBoxRef} 
            className="prose w-full max-w-none overflow-y-auto"
            style={{ maxHeight: '50vh' }}
          >
            {completedEntries.map((entry, index) => (
              <div key={`completed-${index}`} className="text-sm sm:text-base mb-2">
                {entry}
              </div>
            ))}
            {showTyping && shouldStartTyping && currentIndex < entries.length && (
              <div className="text-sm sm:text-base mb-2">
                <Typewriter
                  options={{
                    strings: [entries[currentIndex]],
                    autoStart: true,
                    loop: false,
                    delay: 30,
                    cursor: "▋",
                    onStringTyped: () => {
                      setTimeout(scrollToBottom, 100);
                    },
                  }}
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