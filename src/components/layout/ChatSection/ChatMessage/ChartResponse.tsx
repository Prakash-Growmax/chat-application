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


const ChartResponse = ({ data, layout, summary, onContentChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedEntries, setCompletedEntries] = useState([]);
  const chatBoxRef = useRef(null);
  const [isPlotRendered, setIsPlotRendered] = useState(false); // Track Plotly rendering
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Preprocess the summary with the formatting function
  const formattedSummary = formatSummary(summary);
  const entries = formattedSummary.split("\n"); // Split formatted summary into lines

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const aspectRatio = 0.6; // Maintain aspect ratio
        const calculatedHeight = containerWidth * aspectRatio;

        setDimensions({
          width: containerWidth,
          height: Math.min(calculatedHeight, 400), // Cap maximum height
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Add resize listener
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Merge layoutDimensions into the layout object
  const dynamicLayout = {
    ...layout,
    width: dimensions.width,
    height:600,
  };

  useEffect(() => {
    // After Plotly chart has rendered, start the typing effect
    if (isPlotRendered && currentIndex < entries.length) {
      const timer = setTimeout(() => {
        setCompletedEntries((prev) => [...prev, entries[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        onContentChange?.(); // Notify parent of content change
      }, entries[currentIndex].length * 20 + 500); // Adjust typing speed
      return () => clearTimeout(timer);
    }
  }, [currentIndex, entries, isPlotRendered, onContentChange]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  // Automatically scroll to bottom on content change
  useEffect(() => {
    scrollToBottom();
  }, [completedEntries]);

  const handlePlotRender = () => {
    setIsPlotRendered(true); // Mark Plotly render as complete
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
          onInitialized={handlePlotRender} // Handle when Plotly is initialized
          onUpdate={handlePlotRender} // Handle when Plotly updates
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

        {/* Typewriter Effect */}
        <div className="prose">
          {completedEntries.map((entry, index) => (
            <div key={`completed-${index}`}>{entry}</div>
          ))}
          {currentIndex < entries.length && (
            <div>
              <Typewriter
                options={{
                  strings: [entries[currentIndex]],
                  autoStart: true,
                  loop: false,
                  delay: 20, // Adjust delay for typing speed
                  cursor: "",
                  onStringTyped: scrollToBottom, // Scroll to bottom after each string is typed
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
