import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";

const InsightResponse = ({ data, onContentChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedEntries, setCompletedEntries] = useState([]);

  // Break paragraphs into individual lines
  const entries = Object.entries(data).flatMap(([key, value]) => {
    const formattedKey = key.replace(/_/g, " ").toUpperCase();
    if (Array.isArray(value)) {
      return [`${formattedKey}:`, ...value.map((item) => `• ${item}`)];
    } else if (typeof value === "string") {
      // Split paragraphs into individual lines for typing
      return [`${formattedKey}:`, ...value.split("\n")];
    } else {
      return [`${formattedKey}:`, `${value}`];
    }
  });

  useEffect(() => {
    if (currentIndex < entries.length) {
      const timer = setTimeout(() => {
        setCompletedEntries((prev) => [...prev, entries[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        onContentChange?.(); // Notify parent of content change
      }, entries[currentIndex].length * 10 + 200); // Faster timing
      return () => clearTimeout(timer);
    }
  }, [currentIndex, entries, onContentChange]);

  return (
    <div className="flex flex-col m-auto text-base py-2">
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
              delay: 15, // Faster typing speed
              cursor: "",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InsightResponse;
