import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";

const InsightResponse = ({ data, isTyping, isAssistant, onContentChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedEntries, setCompletedEntries] = useState([]);

  // Break paragraphs into individual lines
  const entries = Object.entries(data).flatMap(([key, value]) => {
    const formattedKey = key.replace(/_/g, " ").toUpperCase();
    if (Array.isArray(value)) {
      return [`${formattedKey}:`, ...value.map((item) => `• ${item}`)];
    } else if (typeof value === "string") {
      return [`${formattedKey}:`, ...value.split("\n")];
    } else {
      return [`${formattedKey}:`, `${value}`];
    }
  });

  const showTyping = isTyping && isAssistant;

  useEffect(() => {
    if (currentIndex < entries.length && showTyping) {
      const timer = setTimeout(() => {
        setCompletedEntries((prev) => [...prev, entries[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        onContentChange?.(); // Notify parent of content change
      }, entries[currentIndex].length * 2 + 50); // Faster timing
      return () => clearTimeout(timer);
    }
  }, [currentIndex, entries, onContentChange, showTyping]);

  return (
    <div className="flex flex-col m-auto text-base py-2">
      {showTyping ? (
        <>
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
                  delay: 1, // Faster typing speed
                  cursor: "",
                }}
              />
            </div>
          )}
        </>
      ) : (
        entries.map((entry, index) => (
          <div key={`entry-${index}`}>{entry}</div>
        ))
      )}
    </div>
  );
};

export default InsightResponse;
