import React, { useState } from 'react'
import { ArrowLeft, Image, Send, Robot } from 'lucide-react'

export const AIAdvisorScreen: React.FC = () => {
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
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div>
        {/* Header */}
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <div className="text-[#111418] flex size-12 shrink-0 items-center">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">AI Advisor</h2>
        </div>

        {/* Welcome Message */}
        <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
          Hi, I'm your AI financial advisor. How can I help you today?
        </p>

        {/* Quick Questions */}
        <div className="space-y-0">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-center gap-4 bg-white px-4 min-h-14">
              <p className="text-[#111418] text-base font-normal leading-normal flex-1 truncate">{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div>
        <div className="flex items-center px-4 py-3 gap-3 @container">
          <label className="flex flex-col min-w-40 h-12 flex-1">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <input
                placeholder="Ask me anything..."
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#617589] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="flex border-none bg-[#f0f2f4] items-center justify-center pr-4 rounded-r-xl border-l-0 !pr-2">
                <div className="flex items-center gap-4 justify-end">
                  <div className="flex items-center gap-1">
                    <button className="flex items-center justify-center p-1.5">
                      <Image className="w-5 h-5 text-[#617589]" />
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#1380ec] text-white text-sm font-medium leading-normal hidden @[480px]:block"
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
