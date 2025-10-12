import { Bot, Send, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIAdvisorScreen() {
  const { getTotals, transactions, goals, budgets } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Financial Advisor. I can help you understand your spending patterns, set financial goals, and provide personalized advice. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "How's my spending this month?",
    "Am I on track with my budget?",
    "What are my biggest expenses?",
    "How can I save more?",
    "Review my financial goals",
    "Give me a spending report"
  ];

  const generateAIResponse = (userMessage: string): string => {
    const totals = getTotals();
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('spending') || lowerMessage.includes('expenses')) {
      const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);
      
      const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      
      return `Based on your transaction history, you've spent $${totals.expenses.toLocaleString()} in total. Your largest expense category is ${topCategory?.[0] || 'N/A'} at $${topCategory?.[1]?.toLocaleString() || 0}. Consider reviewing this category for potential savings.`;
    }

    if (lowerMessage.includes('budget')) {
      const overBudget = budgets.filter(b => b.spent > b.limit);
      if (overBudget.length > 0) {
        return `You're currently over budget in ${overBudget.length} ${overBudget.length === 1 ? 'category' : 'categories'}: ${overBudget.map(b => b.category).join(', ')}. I recommend reviewing these expenses and adjusting your spending habits.`;
      }
      return `Great news! You're staying within your budget limits across all categories. Keep up the good work!`;
    }

    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      const savingsRate = totals.income > 0 ? ((totals.income - totals.expenses) / totals.income * 100).toFixed(1) : 0;
      return `You're currently saving ${savingsRate}% of your income. Financial experts recommend saving at least 20% of your income. Consider cutting back on non-essential expenses or finding ways to increase your income.`;
    }

    if (lowerMessage.includes('goal')) {
      if (goals.length === 0) {
        return `You haven't set any financial goals yet. Setting clear, measurable goals is a great way to stay motivated and track your progress. Would you like help setting up your first goal?`;
      }
      const goalProgress = goals.map(g => `${g.name}: ${((g.currentAmount / g.targetAmount) * 100).toFixed(0)}% complete`).join(', ');
      return `Here's your goal progress: ${goalProgress}. Keep up the momentum!`;
    }

    if (lowerMessage.includes('report') || lowerMessage.includes('summary')) {
      return `Financial Summary:\n💰 Total Income: $${totals.income.toLocaleString()}\n💸 Total Expenses: $${totals.expenses.toLocaleString()}\n📊 Net Worth: $${totals.balance.toLocaleString()}\n📈 Transactions: ${transactions.length}\n🎯 Active Goals: ${goals.length}\n\nYou're ${totals.balance >= 0 ? 'in good financial shape' : 'spending more than earning'}. ${totals.balance < 0 ? 'Consider reviewing your expenses.' : 'Keep up the good work!'}`;
    }

    return `That's a great question! Based on your financial data, I see you have ${transactions.length} transactions, with a net worth of $${totals.balance.toLocaleString()}. Is there anything specific you'd like to know about your finances?`;
  };

  const handleSend = (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(textToSend),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-white mb-1 text-2xl font-bold">AI Financial Advisor</h2>
            <p className="text-blue-100">Powered by advanced AI</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-4 rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
              <p
                className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-gray-700" />
          <p className="text-gray-600 text-sm font-medium">Quick questions:</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSend(question)}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left font-medium"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 border border-gray-200 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your finances..."
            className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-purple-600 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}