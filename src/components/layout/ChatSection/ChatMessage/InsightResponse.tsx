import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";

const InsightResponse = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the index being typed
  const [completedEntries, setCompletedEntries] = useState([]); // Track completed entries

  const entries = Object.entries(data).flatMap(([key, value]) => {
    const formattedKey = key.replace(/_/g, " ").toUpperCase();
    if (Array.isArray(value)) {
      return [
        
        `${formattedKey}:`,
        ...value.map((item) => `• ${item}`), 
      ];
    } else {
      return [`${formattedKey}:`, `${value}`];
    }
  });

  useEffect(() => {
    if (currentIndex < entries.length) {
   
      const timer = setTimeout(() => {
        setCompletedEntries((prev) => [...prev, entries[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1); // Increment index
      }, entries[currentIndex].length * 30 + 1000); // Dynamic delay
      return () => clearTimeout(timer); // Clean up timer
    }
  }, [currentIndex, entries]);

  return (
    <div className="flex flex-col m-auto text-base py-2">
      {completedEntries.map((entry, index) => (
        <div key={`completed-${index}`} className="">
          {entry}
        </div>
      ))}
      {currentIndex < entries.length && (
        <div className="">
          <Typewriter
            options={{
              strings: [entries[currentIndex]],
              autoStart: true,
              loop: false,
              delay: 30,
              cursor: "",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InsightResponse;

