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
      // Remove number prefix from headings and make them bold
      if (/^\d+\.\s/.test(line)) {
        const cleanHeader = line.replace(/^\d+\.\s/, "").trim();
        return `**${cleanHeader}**`;
      }
      
      // Handle bullet points
      let cleanLine = line.replace(/^[-•*]\s*/, "").trim();
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
        onContentChange?.(); // Notify parent of content change
      }, entries[currentIndex].length * 10 + 200);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, entries, onContentChange, showTyping]);

  const renderEntry = (entry) => {
    if (entry.startsWith("**") && entry.endsWith("**")) {
      const headerText = entry.replace(/\*\*/g, "");
      return <div className="font-bold my-2">{headerText}</div>;
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
                  delay:5,
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