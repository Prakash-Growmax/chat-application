import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useTokens } from "@/hooks/useTokens";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import LucideIcon from "../Custom-UI/LucideIcon";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  tokenCost: number;
}

interface ChatWindowProps {
  fileName?: string;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatWindow({ fileName, onSendMessage }: ChatWindowProps) {
  const { user } = useAuth();
  const { processAction } = useTokens();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Show me a summary of the data",
    "What are the main trends?",
    "Calculate average values",
    "Find outliers in the data",
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !user) return;

    const chatId = Date.now().toString(); // In production, use a proper chat ID
    setLoading(true);

    try {
      // First, try to process the tokens
      const tokenCost = await processAction(chatId, "text_question", input, {
        fileName,
      });

      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        role: "user",
        timestamp: new Date(),
        tokenCost,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      // Process the actual message
      await onSendMessage(input);

      // Simulate AI response with token cost
      const aiResponse =
        "This is a simulated AI response based on your CSV data.";
      const aiTokenCost = await processAction(
        chatId,
        "text_question",
        aiResponse,
        { fileName, isResponse: true }
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
        tokenCost: aiTokenCost,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to process message");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="flex h-[600px] flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center space-x-2">
          <LucideIcon name={"MessageSquare"} className="h-5 w-5" />
          <span className="font-medium">Chat Assistant</span>
        </div>
        {fileName && (
          <span className="text-sm text-muted-foreground">
            Analyzing: {fileName}
          </span>
        )}
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <div className="mt-1 flex justify-between gap-2 text-xs opacity-70">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  <span>{message.tokenCost} tokens</span>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="animate-pulse bg-muted rounded-lg px-4 py-2">
                Analyzing...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h3 className="font-medium">Ask questions about your data</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="secondary"
                  size="sm"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LucideIcon name={"Loader2"} className="h-4 w-4 animate-spin" />
            ) : (
              <LucideIcon name={"Send"} className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
