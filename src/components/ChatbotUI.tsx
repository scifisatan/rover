
import React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Send, Upload } from "lucide-react"
import { BarChart } from "@/components/charts/BarChart"
import { ScatterPlot } from "@/components/charts/ScatterPlot"

const AIIcon = () => (
  <motion.div
    className="relative w-10 h-10"
    initial="hidden"
    animate="visible"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-500 rounded-xl opacity-80"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <Sparkles className="w-5 h-5 text-white" />
    </div>
  </motion.div>
)

interface ChatResponse {
  message: string
  showChart: boolean
  chartType: "bar" | "scatter" | "none"
  chartData: any[]
  visualAnalysis?: {
    caption: string;
    text: string;
  }
}

interface Message {
  text: string
  isUser: boolean
  showChart?: boolean
  chartData?: any
  chartType?: "bar" | "scatter"
}

export const ChatbotUI: React.FC<{ businessData: any }> = ({ businessData }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Convert file to base64 for direct use
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = () => {
        const base64String = reader.result as string
        setImageUrl(base64String)
        console.log('Image uploaded successfully:', base64String.substring(0, 50) + '...');
      }

      reader.onerror = (error) => {
        console.error('Error reading file:', error)
        throw new Error('Failed to read file')
      }
    } catch (error) {
      console.error("Error handling image:", error)
    }
  }

  const API_URL = import.meta.env.VITE_CHATBOT_URL;

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Log the outgoing request data
    console.log('Sending request with data:', {
      message: input,
      businessData,
      imageUrl
    });

    setMessages(prev => [...prev, { text: input, isUser: true }])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch(`${API_URL}api/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: "cors", // Explicitly set CORS mode
        body: JSON.stringify({
          message: input,
          businessData,
          imageUrl
        })
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json()
      
      // Log the received response data
      console.log('Received response:', data);
      
      setMessages(prev => [...prev, {
        text: data.message,
        isUser: false,
        showChart: data.showChart,
        chartType: data.chartType === "none" ? undefined : data.chartType,
        chartData: data.chartData
      }])
    } catch (error) {
      console.error("Chat error details:", error);
      setMessages(prev => [...prev, {
        text: "Sorry, I encountered an error. Please try again. Error: " + (error as Error).message,
        isUser: false
      }])
    } finally {
      setIsTyping(false)
      setImageUrl(null) // Reset image after sending
    }
  }

  // Log when business data changes
  React.useEffect(() => {
    console.log('Business data updated:', businessData);
  }, [businessData]);

  return (
    <div className="flex flex-col h-[600px] bg-white/[0.02] border border-white/[0.08] rounded-xl overflow-hidden backdrop-blur-xl">
      <div className="flex items-center p-4 bg-white/[0.06] border-b border-white/[0.08]">
        <AIIcon />
        <div className="ml-3">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
            AI Assistant
          </h2>
          <p className="text-sm text-white/60">Personal Business Assistant</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl backdrop-blur-sm
                  ${message.isUser 
                    ? "bg-gradient-to-r from-violet-600/80 to-purple-600/80 text-white ml-12" 
                    : "bg-white/[0.06] border border-white/[0.08] text-white/90 mr-12"}`}
                >
                  {message.text}
                </div>
              </div>
              {message.showChart && message.chartData && message.chartData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.08]"
                >
                  {message.chartType === "bar" ? (
                    <BarChart
                      data={message.chartData}
                      xDataKey="category"
                      bars={[
                        { dataKey: "value", fill: "#8884d8" },
                        ...(message.chartData[0]?.comparison !== undefined ? [{ dataKey: "comparison", fill: "#82ca9d" }] : [])
                      ]}
                    />
                  ) : message.chartType === "scatter" ? (
                    <ScatterPlot
                      data={message.chartData}
                      xDataKey="x"
                      yDataKey="y"
                      name="Data Points"
                      fill="#8884d8"
                    />
                  ) : null}
                </motion.div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-white/60"
            >
              <motion.div
                className="w-2 h-2 bg-white/40 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.div
                className="w-2 h-2 bg-white/40 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-white/40 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white/[0.06] border-t border-white/[0.08]">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-grow bg-white/[0.05] border-white/10 text-white placeholder:text-white/40
              focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="p-2 bg-white/[0.05] rounded-md cursor-pointer hover:bg-white/[0.08]
              transition-colors duration-200"
          >
            <Upload className="w-5 h-5 text-white/70" />
          </label>
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700
              text-white shadow-lg shadow-purple-500/20"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {imageUrl && (
          <div className="mt-2 flex items-center space-x-2">
            <img src={imageUrl} alt="Uploaded" className="h-8 w-8 rounded object-cover" />
            <button
              onClick={() => setImageUrl(null)}
              className="text-xs text-white/60 hover:text-white/80"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}



