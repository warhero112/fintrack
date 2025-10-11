import React, { useState } from 'react'
import { Send, Bot, ArrowLeft, Sparkles } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface AIAdvisorScreenProps {
  isMobileView: boolean
}

export const AIAdvisorScreen: React.FC<AIAdvisorScreenProps> = ({ isMobileView }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI financial advisor. How can I help you with your finances today?",
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const { getTotals, getMonthlyTotals, getCategoryTotals } = useAppStore()

  const quickQuestions = [
    "How can I save more money?",
    "What's my net worth?",
    "How can I improve my credit score?",
    "Should I invest in stocks?",
    "How much should I save for retirement?",
    "What's a good budget breakdown?"
  ]

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string) => {
    const totals = getTotals()
    const monthlyTotals = getMonthlyTotals()
    
    if (userMessage.toLowerCase().includes('net worth')) {
      return `Your current net worth is $${totals.netWorth.toFixed(2)}. This includes $${totals.totalIncome.toFixed(2)} in total income and $${totals.totalExpense.toFixed(2)} in total expenses.`
    }
    
    if (userMessage.toLowerCase().includes('save')) {
      return `Based on your current spending of $${monthlyTotals.expense.toFixed(2)} this month, I recommend setting aside 20% of your income for savings. Consider automating your savings to make it easier.`
    }
    
    if (userMessage.toLowerCase().includes('budget')) {
      return `A good budget breakdown is: 50% for needs (housing, food, utilities), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment.`
    }
    
    return `I understand you're asking about "${userMessage}". Based on your financial data, I'd recommend focusing on building an emergency fund of 3-6 months of expenses first, then consider investing in a diversified portfolio.`
  }

  const handleQuickQuestion = (question: string) => {
    setMessage(question)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Financial Advisor</h1>
              <p className="text-sm text-gray-500">Powered by AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Questions</h3>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your finances..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
