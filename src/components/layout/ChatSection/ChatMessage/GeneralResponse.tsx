import { useEffect, useState } from "react";
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
      if (/^\d+\.\s/.test(line)) {
        const cleanHeader = line.replace(/^\d+\.\s/, "").trim();
        return `**${cleanHeader}**`;
      }
      
      let cleanLine = line.replace(/^[-•*]\s*/, "").trim();
      if (cleanLine && !/^\d+\./.test(line)) {
        return `• ${cleanLine}`;
      }
      return line;
    })
    .filter((line) => line.trim());

  return formattedLines.map((line) => line.replace(/^###\s*/, "")).join("\n");
};

const GeneralResponse = ({ message, isTyping, isAssistant, onContentChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedEntries, setCompletedEntries] = useState([]);

  const formattedSummary = formatSummary(message);
  const entries = formattedSummary.split("\n");
  const showTyping = isTyping && isAssistant;

  useEffect(() => {
    if (currentIndex < entries.length && showTyping) {
      const timer = setTimeout(() => {
        setCompletedEntries((prev) => [...prev, entries[currentIndex]]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        onContentChange?.();
      }, entries[currentIndex].length * 2 + 50); // Increased typing speed

      return () => clearTimeout(timer);
    }
  }, [currentIndex, entries, onContentChange, showTyping]);

  const renderEntry = (entry) => {
    if (entry.startsWith("**") && entry.endsWith("**")) {
      return <div className="font-bold my-2">{entry.replace(/\*\*/g, "")}</div>;
    }
    return <div>{entry}</div>;
  };

  return (
    <div className="flex flex-col m-auto text-base py-2">
      {showTyping ? (
        <>
          {completedEntries.map((entry, index) => (
            <div key={`completed-${index}`}>{renderEntry(entry)}</div>
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
          <div key={`entry-${index}`}>{renderEntry(entry)}</div>
        ))
      )}
    </div>
  );
};

export default GeneralResponse;
