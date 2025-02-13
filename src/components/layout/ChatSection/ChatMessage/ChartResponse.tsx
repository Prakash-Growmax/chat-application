import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import Typewriter from "typewriter-effect";

const cleanSummaryText = (text) => {
  if (!text) return '';
  return text
    .split('\n')
    .map(line => {
      // Check if the line is a heading (ends with ':')
      if (line.trim().endsWith(':')) {
        const cleanedLine = line
          .replace(/^[#*\-]+\s*/, '') // Remove leading '#', '*', or '-'
          .trim();
        return `**${cleanedLine}**`; // Add bold formatting for headings
      }
      // For normal points, clean up and add a bullet
      const cleanedLine = line
        .replace(/^[#*\-]+\s*/, '') // Remove leading '#', '*', or '-'
        .trim();
      return cleanedLine ? ` ${cleanedLine}` : ''; // Add bullet for non-empty lines
    })
    .filter(Boolean) // Remove empty lines
    .join('\n');
};



const ChartResponse = ({
  data = [],
  layout = {},
  summary = "",
  onContentChange,
  isTyping = false,
  isAssistant = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedEntries, setCompletedEntries] = useState([]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const chatBoxRef = useRef(null);
  const [isPlotRendered, setIsPlotRendered] = useState(false);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [shouldStartTyping, setShouldStartTyping] = useState(false);

  const formattedSummary = summary ? cleanSummaryText(summary) : "";
  const entries = formattedSummary ? formattedSummary.split('\n') : [];
  const showTyping = isTyping && isAssistant;

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
      height = width * 1.2;
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
        tickfont: {
          size: isMobile ? 6 : 11,
        },
      },
      yaxis: {
        ...layout.yaxis,
        tickfont: {
          size: isMobile ? 6 : 11,
        },
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

  useEffect(() => {
    if (showTyping && isPlotRendered && shouldStartTyping && currentIndex < entries.length) {
      const timer = setTimeout(() => {
        setCompletedEntries((prev) => {
          const newEntries = [...prev, entries[currentIndex]];
          if (currentIndex > 0) {
            setTimeout(scrollToBottom, 100);
          }
          return newEntries;
        });
        setCurrentIndex((prev) => prev + 1);
        onContentChange?.();
      }, 1000);

      return () => clearTimeout(timer);
    } else if (!showTyping && completedEntries.length === 0 && entries.length > 0) {
      setCompletedEntries(entries);
      setIsTypingComplete(true);
    }
  }, [currentIndex, entries, isPlotRendered, shouldStartTyping, onContentChange, showTyping]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full py-2">
          <div ref={containerRef} className="relative w-full flex justify-center mb-4">
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
          </div>

          <div
            ref={chatBoxRef}
            className="prose w-full max-w-none px-2 sm:px-0"
            style={{
              maxHeight: "80vh",
              fontSize: window.innerWidth < 640 ? "0.875rem" : "1rem",
            }}
          >
            {completedEntries.map((entry, index) => (
              <div
                key={`completed-${index}`}
                className="mb-2"
                dangerouslySetInnerHTML={{ __html: entry.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }}
              />
            ))}
            {showTyping && shouldStartTyping && currentIndex < entries.length && (
              <div className="mb-2">
                <Typewriter
                  options={{
                    strings: [entries[currentIndex]],
                    autoStart: true,
                    loop: false,
                    delay: 30,
                    cursor: "▋",
                    onStringTyped: () => {
                      if (currentIndex > 0) {
                        setTimeout(scrollToBottom, 100);
                      }
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
