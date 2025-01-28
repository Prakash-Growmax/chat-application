import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import Typewriter from "typewriter-effect";

const formatSummary = (text) => {
  // Remove all unnecessary asterisks
  let cleanText = text
    .replace(/\*\*/g, "")
    // Remove excess whitespace and newlines
    .replace(/\n\s*\n/g, "\n")
    // Trim whitespace from each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  // Split into lines for processing
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

  // Remove the '###' from the summary
  const cleanedFormattedLines = formattedLines.map((line) =>
    line.replace(/^###\s*/, "")
  );

  return cleanedFormattedLines.join("\n");
};


const ChartResponse = ({ data, layout, summary, onContentChange, isTyping, isAssistant }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedEntries, setCompletedEntries] = useState([]);
  const chatBoxRef = useRef(null);
  const [isPlotRendered, setIsPlotRendered] = useState(false);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Preprocess the summary with the formatting function
  const formattedSummary = formatSummary(summary);
  const entries = formattedSummary.split("\n");
  const showTyping = isTyping && isAssistant;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const aspectRatio = 0.6;
        const calculatedHeight = containerWidth * aspectRatio;

        setDimensions({
          width: containerWidth,
          height: Math.min(calculatedHeight, 400),
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const dynamicLayout = {
    ...layout,
    width: dimensions.width,
    height:dimensions.height,
  };

  useEffect(() => {
    if (showTyping && isPlotRendered && currentIndex < entries.length) {
      const timer = setTimeout(() => {
        setCompletedEntries((prev) => [...prev, entries[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        onContentChange?.();
      }, entries[currentIndex].length * 20 + 500);

      return () => clearTimeout(timer);
    } else if (!showTyping && completedEntries.length === 0) {
      // When showTyping is false, immediately add all entries
      setCompletedEntries(entries);
    }
  }, [currentIndex, entries, isPlotRendered, onContentChange, showTyping]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [completedEntries]);

  const handlePlotRender = () => {
    setIsPlotRendered(true);
  };

  return (
    <div
      ref={chatBoxRef}
      className="chatBox overflow-auto max-h-screen"
      style={{ maxHeight: "150vh", overflowY: "auto" }}
    >
      <div className="chatMessage flex flex-col m-auto text-base py-2">
        {/* Plotly Component */}
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
        />

        {/* Summary Display */}
        <div className="prose">
          {completedEntries.map((entry, index) => (
            <div key={`completed-${index}`}>{entry}</div>
          ))}
          {showTyping && currentIndex < entries.length && (
            <div>
              <Typewriter
                options={{
                  strings: [entries[currentIndex]],
                  autoStart: true,
                  loop: false,
                  delay: 20,
                  cursor: "",
                  onStringTyped: () => {
                    if (chatBoxRef.current) {
                      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                    }
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartResponse;

