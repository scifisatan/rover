import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Message {
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatBotProps {
  websiteData: any
}

export const ChatBot = ({ websiteData }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('chatbot-enabled')
    return saved === null ? true : saved === 'true'
  })
  const [isVisible, setIsVisible] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      content: `Hi! I'm your friendly assistant. I can help you learn more about ${websiteData.business_name}. What would you like to know?`,
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    localStorage.setItem('chatbot-enabled', isEnabled.toString())
    if (!isEnabled) {
      setIsOpen(false)
    }
  }, [isEnabled])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { content: userMessage, role: 'user', timestamp: new Date() }])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          businessData: websiteData
        })
      })

      const data = await response.json()
      setMessages(prev => [...prev, {
        content: data.message,
        role: 'assistant',
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setIsOpen(false)
  }

  const handleToggleChat = () => {
    setIsOpen(prev => !prev)
  }

  const handleToggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(prev => !prev)
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 rounded-full bg-primary/90 hover:bg-primary/80 backdrop-blur-sm shadow-lg p-4 transition-all"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    )
  }

  if (!isEnabled) {
    return (
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-3 shadow-lg">
        <Label htmlFor="chatbot-toggle" className="text-sm font-medium text-white">Enable Chat</Label>
        <Switch
          id="chatbot-toggle"
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
          className="data-[state=checked]:bg-primary"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-8 w-8 hover:bg-white/10"
        >
          <X className="h-5 w-5 text-white/90 hover:text-white" />
        </Button>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <Button
        onClick={handleToggleChat}
        className="fixed bottom-4 right-4 rounded-full bg-primary/90 hover:bg-primary/80 backdrop-blur-sm shadow-lg p-4 transition-all"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    )
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl transition-all duration-300 ease-in-out
        ${isMinimized ? 'w-72 h-14' : 'w-96 h-[600px]'} flex flex-col z-50`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.03) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/10 rounded-lg">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-white font-semibold text-lg">Saathi</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleMinimize}
            className="bg-white/10 hover:bg-white/20"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4 text-white" />
            ) : (
              <Minimize2 className="h-4 w-4 text-white" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="bg-red-500/20 hover:bg-red-500/30"
          >
            <X className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 h-[480px] space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-xl p-3 max-w-[85%] transition-all duration-200 ${
                    message.role === 'user' 
                      ? 'bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg' 
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 shadow-md hover:shadow-lg'
                  }`}
                >
                  <p className={`text-sm leading-relaxed ${
                    message.role === 'user' 
                      ? 'text-white' 
                      : 'text-white/90'
                  }`}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-white/70' 
                      : 'text-white/60'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-white/5">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2 w-full"
            >
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="w-full pr-12 border-white/20 bg-white/10 backdrop-blur-sm 
                    placeholder:text-white/50 focus:ring-2 focus:ring-white/30
                    text-white"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1 top-1/2 -translate-y-1/2 
                    bg-white/20 hover:bg-white/30
                    transition-all h-8 w-8 hover:scale-105"
                  size="icon"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}