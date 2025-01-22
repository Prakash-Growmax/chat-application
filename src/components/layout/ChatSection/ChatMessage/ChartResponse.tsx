import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import Typewriter from "typewriter-effect";
const ChartResponse = ({ data, layout,summary }) => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          // Set height as a proportion of the width to maintain aspect ratio
          const aspectRatio = 0.6; // You can adjust this value
          const calculatedHeight = containerWidth * aspectRatio;
          
          setDimensions({
            width: containerWidth,
            height: Math.min(calculatedHeight, 400) // Cap maximum height
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
    width:dimensions.width,
    height:dimensions.height,
  };
  const formatSummary = (text) => {
    // Remove all unnecessary asterisks
    let cleanText = text.replace(/\*\*/g, '')
      // Remove excess whitespace and newlines
      .replace(/\n\s*\n/g, '\n')
      // Trim whitespace from each line
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    
    // Split into lines for processing
    const lines = cleanText.split('\n');
    
    // Process each line
    const formattedLines = lines.map(line => {
      // Remove any existing bullet points or dashes
      let cleanLine = line.replace(/^[-•*]\s*/, '').trim();
      
      // Check if this is a main section header (numbered)
      if (/^\d+\./.test(line)) {
        return line; // Keep headers as is, without extra spacing
      }
      
      // Add bullet points to non-header lines that aren't empty
      if (cleanLine && !/^\d+\./.test(line)) {
        return `• ${cleanLine}`;
      }
      
      return line;
    }).filter(line => line.trim()); // Remove empty lines
    
    // Join with single newlines
    return formattedLines.join('\n');
  };
  return (
    <div className="flex flex-col m-auto text-base py-2">
      <Plot
        data={data}
        layout={dynamicLayout}
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
    <div className="prose">
        <Typewriter
          options={{
            strings: [formatSummary(summary)],
            autoStart: true,
            delay: 30,
            cursor: "",
            deleteSpeed: 9999999,
            wrapperClassName: "whitespace-pre-line text-lg leading-relaxed",
          }}
        />
      </div>
    </div>
  );
};

export default ChartResponse;
