import { Message } from "@/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Typewriter from "typewriter-effect";

import { Bot, User } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import SwitchButton from "../ui/Switchbutton";
import { DataChart } from "./DataChat";
import DataTable from "./DataTable";
interface ChatMessageProps {
  message: Message;
  recent: boolean;
  openRight:boolean;
}
export function ChatMessage({ message,openRight }: ChatMessageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isUser = message.role === "user";
  const [layoutDimensions, setLayoutDimensions] = useState({
    width: 500,
    height: 350,
  });
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayoutDimensions({ width: 300, height: 300 });
      } else {
        setLayoutDimensions({ width: 500, height: 350 });
      }
    };

    // Set initial dimensions
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    if (message.type === "text") {
      return (
        <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {message.isTyping ? (
            <Typewriter
              options={{
                strings: [message.content],
                autoStart: true,
                delay: 30,
                cursor: "",
              }}
            />
          ) : (
            <p className="text-sm font-semibold text-muted-foreground">{message.content}</p>
          )}
        </div>
      );
    }

    if (message.type === "chart") {
      return (
        <motion.div
          initial={{ opacity: 0, transform: "scale(0.95)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          transition={{ duration: 0.5 }}
          className="relative mt-4"
        >
          {/* <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4 text-gray-500 hover:text-gray-800" />
            </Button> */}
          {/* <div style={{ width: '600px', height: '350px' }} className="flex flex-col"> */}

          <div className={`flex flex-col  lg:w-[800px] lg:h-[500px] md:w-[500px] w-[300px] md:h-[480px]  max-w-full ${openRight ? "lg:w-[590px] lg:h-[450px]" : ""}`}>
            <div className="flex justify-end md:mr-28 mb-2 ">
              <SwitchButton isChecked={isChecked} setIsChecked={setIsChecked} />
            </div>
            <div>
              {isChecked ? (
                <>
                  <Plot
                    data={[
                      {
                        type: "bar",
                        x: ["Product A", "Product B", "Product C"],
                        y: [20, 14, 23],
                        name: "Sales",
                        marker: { color: "rgb(55, 83, 109)" },
                      },
                    ]}
                    layout={{
                      title: {
                        text: "Sales Data",
                        font: { size: 24 },
                      },
                      xaxis: {
                        title: "Products",
                        showgrid: true,
                        zeroline: true,
                      },
                      yaxis: {
                        title: "Quantity Sold",
                        showgrid: true,
                        zeroline: true,
                      },
                      barmode: "group",
                      width: layoutDimensions.width,
                      height: layoutDimensions.height,
                    }}
                  />
                </>
              ) : (
                <div>
                  <DataTable />
                </div>
              )}
            </div>

            {/* <DataChart data={message.data} /> */}
          </div>

          {/* <hr className="m-2 border-gray-300 w-full" /> */}
          {/* <button
          onClick={handleDownload}
          className="bg-transparent text-gray-500 py-2 px-4 rounded mt-4"
        >
          Download Chart as PNG
        </button> */}
  
            
         
          
          </motion.div>
        );
      }
  
      if (message.type === "table") {
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 overflow-x-auto"
          >
            <DataTable/>
            {/* <DataTable data={message.data} /> */}
          </motion.div>
        );
      }
    };
  
    return (
      <>
      {isUser ? ( <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-center">
              <div className="flex flex-col  bg-white lg:w-[70%] md:w-[70%] w-[100%] px-4 py-2">
              <div className="flex">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-primary-foreground  ">
              <User className="w-5 h-5" />
              </div>
               <p className="font-bold text-sm ml-2">ajitha@apptino.com</p>
              </div>
              <div className="flex w-full ml-10">
              {renderContent()}
              </div>
              </div>

            </div>
          </motion.div>) : (<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-center">
                <div className="flex flex-col lg:w-[70%] md:w-[70%] w-[100%]">
                  <div className="flex">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground -mt-2">
            <Bot className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm ml-2">
              <p>Assistant G-Chatter</p>
            </div>
                  </div>
                <div className="flex bg-white w-full px-4 py-4 rounded-md">
                  <div className="ml-4">
                  {renderContent()}
                  </div>
              
                </div>
                </div>

              </div>
            </motion.div>)}
    
      
  
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] overflow-auto">
            {message.type === "chart" && <DataChart data={message.data} />}
          </DialogContent>
        </Dialog>
      </>
    );
  }
