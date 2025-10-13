import React, { useState } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface AIAdvisorScreenProps {
  isMobileView: boolean
}

export const AIAdvisorScreen: React.FC<AIAdvisorScreenProps> = ({ isMobileView }) => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Financial Advisor. I can help you understand your spending patterns, set financial goals, and provide personalized advice. How can I assist you today?",
      sender: 'ai' as const,
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const { getTotals, transactions, goals, budgets } = useAppStore()

  const quickQuestions = [
    "How's my spending this month?",
    "Am I on track with my budget?",
    "What are my biggest expenses?",
    "How can I save more?",
    "Review my financial goals",
    "Give me a spending report"
  ]

  const generateAIResponse = (userMessage: string): string => {
    const totals = getTotals()
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('spending') || lowerMessage.includes('expenses')) {
      const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        }, {} as Record<string, number>)
      
      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]
      
      return `Based on your transaction history, you've spent $${totals.totalExpense.toLocaleString()} in total. Your largest expense category is ${topCategory?.[0] || 'N/A'} at $${topCategory?.[1]?.toLocaleString() || 0}. Consider reviewing this category for potential savings.`
    }

    if (lowerMessage.includes('budget')) {
      const overBudget = budgets.filter(b => b.spent > b.limit)
      if (overBudget.length > 0) {
        return `You're currently over budget in ${overBudget.length} ${overBudget.length === 1 ? 'category' : 'categories'}: ${overBudget.map(b => b.category).join(', ')}. I recommend reviewing these expenses and adjusting your spending habits.`
      }
      return `Great news! You're staying within your budget limits across all categories. Keep up the good work!`
    }

    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      const savingsRate = totals.totalIncome > 0 ? ((totals.totalIncome - totals.totalExpense) / totals.totalIncome * 100).toFixed(1) : 0
      return `You're currently saving ${savingsRate}% of your income. Financial experts recommend saving at least 20% of your income. Consider cutting back on non-essential expenses or finding ways to increase your income.`
    }

    if (lowerMessage.includes('goal')) {
      if (goals.length === 0) {
        return `You haven't set any financial goals yet. Setting clear, measurable goals is a great way to stay motivated and track your progress. Would you like help setting up your first goal?`
      }
      const goalProgress = goals.map(g => `${g.name}: ${((g.currentAmount / g.targetAmount) * 100).toFixed(0)}% complete`).join(', ')
      return `Here's your goal progress: ${goalProgress}. Keep up the momentum!`
    }

    if (lowerMessage.includes('report') || lowerMessage.includes('summary')) {
      return `Financial Summary:\n💰 Total Income: $${totals.totalIncome.toLocaleString()}\n💸 Total Expenses: $${totals.totalExpense.toLocaleString()}\n📊 Net Worth: $${totals.netWorth.toLocaleString()}\n📈 Transactions: ${transactions.length}\n🎯 Active Goals: ${goals.length}\n\nYou're ${totals.netWorth >= 0 ? 'in good financial shape' : 'spending more than earning'}. ${totals.netWorth < 0 ? 'Consider reviewing your expenses.' : 'Keep up the good work!'}`
    }

    return `That's a great question! Based on your financial data, I see you have ${transactions.length} transactions, with a net worth of $${totals.netWorth.toLocaleString()}. Is there anything specific you'd like to know about your finances?`
  }

  const handleSend = (messageText?: string) => {
    const textToSend = messageText || message
    if (!textToSend.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user' as const,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(textToSend),
        sender: 'ai' as const,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-slate-800 p-8 text-white border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white">AI Financial Advisor</h2>
            <p className="text-slate-300 text-sm">Advanced analytics and recommendations</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <p
                  className={`text-xs mt-2 ${
                    msg.sender === 'user' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Questions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-600" />
          <p className="text-slate-600 text-sm">Quick questions:</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSend(question)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm hover:bg-slate-50 transition-all text-left"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your finances..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!message.trim()}
            className="px-4 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
