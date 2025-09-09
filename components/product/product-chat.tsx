"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Send, Bot, User, LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define the structure of a message for TypeScript
interface Message {
  from: "user" | "bot";
  text: string;
  sources?: string[];
  isTyping?: boolean;
}

// Define the props the component will accept
interface ProductChatProps {
  productId: string | number;
  productName: string;
}

export function ProductChat({ productId, productName }: ProductChatProps) {
  // State management for the chat
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Ref for the scrollable message area
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the latest message within the container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const scrollContainer = messagesContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  // Generate session ID and show welcome message on initial component mount
  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([
      {
        from: "bot",
        text: `Hello! How can I help you with the ${productName} today?`,
      },
    ]);
    
    // Clean up function to delete the session when component unmounts
    return () => {
      // Only attempt to delete if we've interacted with the chat (more than welcome message)
      if (messages.length > 1) {
        fetch(`/api/v1/chat/${newSessionId}`, { 
          method: "DELETE" 
        }).catch(err => {
          // Silently handle errors during cleanup
          console.log("Failed to clean up chat session:", err);
        });
      }
    };
  }, [productName]);

  // Scroll to bottom whenever messages array is updated
  useEffect(() => {
    // Use a small timeout to ensure DOM has updated
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (
    e?: React.MouseEvent | React.KeyboardEvent
  ) => {
    // Save current scroll position
    const scrollPosition = window.scrollY;

    if (e) {
      e.preventDefault();
      e.stopPropagation();

      // Make sure the event doesn't bubble up to any parent elements or cause navigation
      if ("nativeEvent" in e) {
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }
    }

    if (!input.trim() || isLoading) return;

    // Restore scroll position after a short delay
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 50);

    const userMessage: Message = { from: "user", text: input };
    const userInput = input.trim();
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Add a typing indicator message
    setMessages((prev) => [...prev, { 
      from: "bot", 
      text: "...",
      isTyping: true 
    }]);

    try {
      const response = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          user_message: input,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      
      // Check if we got a fallback response (frontend mock)
      if (data.fallback) {
        console.log("Using fallback chat response (backend not available)");
        toast({
          title: "Limited AI capabilities",
          description: "The AI backend is currently offline. Using basic responses.",
          variant: "default",
          duration: 5000,
        });
      }

      // Remove the typing indicator and add the real response
      setMessages((prev) => {
        // Filter out the typing indicator
        const filteredMessages = prev.filter(msg => !msg.isTyping);
        
        // Add the new bot message
        return [...filteredMessages, {
          from: "bot",
          text: data.response,
          sources: data.sources || [],
        }];
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      
      // Remove the typing indicator and add the error message
      setMessages((prev) => {
        // Filter out the typing indicator
        const filteredMessages = prev.filter(msg => !msg.isTyping);
        
        // Add the error message
        return [...filteredMessages, {
          from: "bot",
          text: "Sorry, I seem to be having trouble connecting. Please try again in a moment.",
        }];
      });

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-wrapper" onClick={(e) => e.stopPropagation()}>
      <Card className="w-full shadow-lg" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-background">
          <CardTitle className="flex items-center gap-3">
            <div className="bg-primary rounded-full p-1.5 shadow-md">
              {/* <Bot className="h-5 w-5 text-primary-foreground" /> */}
            </div>
            <div>
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                PricePulse AI Assistant
              </span>
            </div>
          </CardTitle>
          <CardDescription className="mt-1.5 ml-1">
            Your shopping expert for {productName}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-[400px] flex flex-col">
            {/* Messages Area - Use a contained scrolling container */}
            <div
              ref={messagesContainerRef}
              className="flex-1 p-4 overflow-y-auto scrollbar-contained bg-gradient-to-b from-background to-muted/20"
              style={{
                scrollBehavior: "smooth",
                overscrollBehavior: "contain",
              }}
              onClick={(e) => e.stopPropagation()}
              onScroll={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      msg.from === "user" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    {msg.from === "bot" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 shadow-md flex items-center justify-center text-primary-foreground">
                        <Bot size={18} />
                      </div>
                    )}

                    <div
                      className={`max-w-xs md:max-w-md p-3.5 rounded-lg shadow-sm ${
                        msg.from === "user"
                          ? "bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-br-none"
                          : "bg-gradient-to-br from-muted to-background border border-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.isTyping ? (
                        <div className="flex items-center space-x-1">
                          <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></span>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      )}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200/30">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="font-semibold opacity-70">
                              Sources:
                            </span>
                            <span className="opacity-70">
                              {msg.sources.join(", ")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {msg.from === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-primary shadow-md flex items-center justify-center text-primary-foreground">
                        <User size={18} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-2 border-t bg-gradient-to-b from-muted/20 to-background rounded-md">
              <div className="flex items-center gap-2 bg-background rounded-lg shadow-sm border border-muted p-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about the product..."
                  className="flex-1 p-2 bg-transparent rounded-md resize-none focus-visible:outline-none focus-visible:ring-0"
                  rows={2}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.nativeEvent) {
                        e.nativeEvent.preventDefault();
                        e.nativeEvent.stopPropagation();
                      }
                      // Use setTimeout to break the event chain
                      setTimeout(() => handleSendMessage(e), 0);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Prevent default at the lowest level
                    if (e.nativeEvent) {
                      e.nativeEvent.preventDefault();
                      e.nativeEvent.stopPropagation();
                    }
                    // Use setTimeout to break the event chain
                    setTimeout(() => handleSendMessage(e), 0);
                  }}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="h-10 w-10 rounded-full shadow-sm bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-all"
                >
                  {isLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Controls and assistant info footer */}
            <div className="px-4 py-1 border-t text-xs flex justify-between items-center text-muted-foreground">
              <p>
                PricePulse AI Assistant
              </p>
              {messages.length > 1 && (
                <button 
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.confirm("Clear this conversation and start a new one?")) {
                      try {
                        await fetch(`/api/v1/chat/${sessionId}`, { method: "DELETE" });
                        // Generate new session ID and reset messages
                        const newSessionId = uuidv4();
                        setSessionId(newSessionId);
                        setMessages([{
                          from: "bot",
                          text: `Hello! How can I help you with the ${productName} today?`,
                        }]);
                        toast({
                          title: "Conversation cleared",
                          description: "Started a new conversation",
                        });
                      } catch (error) {
                        console.error("Failed to clear chat session:", error);
                      }
                    }
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
                >
                  Clear conversation
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
