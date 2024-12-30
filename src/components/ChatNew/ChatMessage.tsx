import { Message } from "@/types";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Typewriter from "typewriter-effect";

import { Bot, User } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import SwitchButton from "../ui/Switchbutton";
import { DataChart } from "./DataChat";
import DataTable from "./DataTable";
import AppContext from "../context/AppContext";
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
  const {open} = useContext(AppContext)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayoutDimensions({ width: 300, height: 300 });
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        // Mid-screen dimensions
        setLayoutDimensions({ width: 400, height: 300 });
      } else {
        // Larger screen dimensions
        setLayoutDimensions({ width: 500, height: 300 });
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
        <div className="text-base leading-relaxed text-justify" style={{ color: "#0D0D0D" }}>
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
            <p className="text-base" style={{ color: "#0D0D0D" }}>
              {message.content}
            </p>
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
            <div className={`flex justify-end mb-2 ${open ? "md:mr-40" : ""}`} >
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
                <div className={open ? "md:mr-40" : ""}>
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
      {isUser ? (<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-center">
              <div className="flex flex-col lg:w-[60%] md:w-[100%] w-[100%] ">
           
              <div className="flex justify-end">
                <div className="w-auto lg:max-w-[60%] md:max-w-[60%] max-w-[80%] px-5 py-2.5 gap-1 rounded-3xl bg-[#E8E8E880]">
                {renderContent()}
                </div>
             
              </div>
              </div>

            </div>
          </motion.div>) : (<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-center py-[18px] lg:px-2 md:px-4 px-3">
                <div className="flex lg:gap-6 md:gap-3 gap-4 lg:w-[60%] md:w-[100%] w-[100%]">
               
                <div className="flex mt-4">
                <Bot className="w-6 h-6" />
                </div>
         
           
          
            
                <div className="flex bg-transparent w-full px-4 py-4 rounded-md">
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
