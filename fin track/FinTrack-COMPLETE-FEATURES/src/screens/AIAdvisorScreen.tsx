import React, { useState } from 'react'
import { ArrowLeft, Image, Send, Robot, Menu } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export const AIAdvisorScreen: React.FC = () => {
  const { setSidebarOpen } = useAppStore()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: "How can I save more money?", isUser: true },
    { id: 2, text: "What's my net worth?", isUser: true },
    { id: 3, text: "How can I improve my credit score?", isUser: true }
  ])

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isUser: true
      }
      setMessages([...messages, newMessage])
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background rounded-2xl shadow-sm border border-border bg-card px-4 py-3 mb-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">AI Advisor</h1>
        <div></div>
      </div>

      <div className="px-4 space-y-4 max-w-md mx-auto">
        {/* Welcome Message */}
        <p className="text-foreground text-base font-normal leading-normal pb-3 pt-1">
          Hi, I'm your AI financial advisor. How can I help you today?
        </p>

        {/* Quick Questions */}
        <div className="space-y-0">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-center gap-4 bg-card px-4 min-h-14 border-b border-border">
              <p className="text-foreground text-base font-normal leading-normal flex-1 truncate">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="flex items-center px-4 py-3 gap-3 @container">
          <label className="flex flex-col min-w-40 h-12 flex-1">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <input
                placeholder="Ask me anything..."
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted focus:border-none h-full placeholder:text-muted-foreground px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="flex border-none bg-muted items-center justify-center pr-4 rounded-r-xl border-l-0 !pr-2">
                <div className="flex items-center gap-4 justify-end">
                  <div className="flex items-center gap-1">
                    <button className="flex items-center justify-center p-1.5">
                      <Image className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-primary text-primary-foreground text-sm font-medium leading-normal hidden @[480px]:block"
                  >
                    <span className="truncate">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
