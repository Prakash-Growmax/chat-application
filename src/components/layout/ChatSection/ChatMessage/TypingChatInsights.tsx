import Typewriter from "typewriter-effect";

const TypingChatInsights = ({
  data,
  isAssistant = true,
  isTyping = true,
}: {
  data: Record<string, any>;
  isAssistant?: boolean;
  isTyping?: boolean;
}) => {
  const shouldShowTyping = isAssistant && isTyping;

  return (
    <div className="flex m-auto text-base">
      {shouldShowTyping ? (
        <div className="py-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-4">
              <h3 className="font-bold capitalize">
                <Typewriter
                  options={{
                    strings: [String(key.replace(/_/g, " "))],
                    autoStart: true,
                    delay: 30,
                    cursor: "",
                    deleteSpeed: 9999999,
                  }}
                />
              </h3>
              {Array.isArray(value) ? (
                <ul className="list-disc pl-6">
                  {value.map((item, index) => (
                    <li key={index}>
                      {" "}
                      <Typewriter
                        options={{
                          strings: [String(item)],
                          autoStart: true,
                          delay: 30,
                          cursor: "",
                          deleteSpeed: 9999999,
                        }}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <Typewriter
                  options={{
                    strings: [String(value)],
                    autoStart: true,
                    delay: 30,
                    cursor: "",
                    deleteSpeed: 9999999,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-4">
              <h3 className="font-bold capitalize">{key.replace(/_/g, " ")}</h3>
              {Array.isArray(value) ? (
                <ul className="list-disc pl-6">
                  {value.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{value}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypingChatInsights;
