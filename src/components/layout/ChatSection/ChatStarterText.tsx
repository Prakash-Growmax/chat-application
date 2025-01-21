import LogoIcon from "@/assets/Logo/LogoIcon";
import { useCallback, useEffect, useState, useTransition } from "react";

function ChatStarterText() {
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [animationState, setAnimationState] = useState("initial");

  const startAnimation = useCallback(() => {
    startTransition(() => {
      setAnimationState("logoMoved");
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      startAnimation();
    }, 100);

    return () => clearTimeout(timer);
  }, [startAnimation]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center justify-center mb-8 p-2">
      <div className=" relative flex  overflow-hidden">
        {/* Logo */}
        <div
          className={`absolute transition-all duration-1000 ease-in-out transform 
            ${
              animationState === "initial"
                ? "left-1/2 -translate-x-1/2"
                : "left-0 translate-x-0"
            }`}
        >
          <div className="transform  transition-transform">
            <LogoIcon width="32px" height="32px" />
          </div>
        </div>

        {/* Welcome Text */}
        <div
          className={` pl-4 transition-all duration-500
            ${
              animationState === "initial"
                ? "opacity-0 translate-y-8"
                : "opacity-100 translate-y-0"
            }`}
        >
          <h1
            className={`text-lg lg:text-3xl md:text-3xl font-semibold px-6 text-center text-gray-800 inline-block transition-all duration-500 
            ${
              animationState === "initial"
                ? "opacity-0 -translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            What do you want to analyze today?
          </h1>
        </div>
      </div>
    </div>
  );
}

export default ChatStarterText;
