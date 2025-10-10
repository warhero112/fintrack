import React, { useState, useEffect } from 'react'
import { Brain, Send, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useAppStore } from '../../stores/appStore'
import { logger } from '../../lib/logger'

export const AIFinancialAdvisor: React.FC = () => {
  const { transactions, goals, budgets } = useAppStore()
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickQuestions = [
    'How can I save more money?',
    'What\'s my spending pattern?',
    'How am I doing with my budget?',
    'What should I focus on financially?'
  ]

  const generateAIResponse = async (userQuery: string) => {
    setIsLoading(true)
    try {
      // Simulate AI response generation
      const mockResponse = generateMockResponse(userQuery)
      setResponse(mockResponse)
      logger.info('AI response generated successfully', { query: userQuery })
    } catch (error) {
      logger.error('Error generating AI insights', error)
      setResponse('Sorry, I encountered an error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
      return `Based on your spending patterns, I recommend:
      
1. **Track your daily expenses** - You're spending $${getAverageDailySpending()} per day
2. **Set up automatic transfers** - Move 20% of income to savings
3. **Review subscriptions** - Cancel unused services
4. **Use the 50/30/20 rule** - 50% needs, 30% wants, 20% savings

Your current savings rate is ${calculateSavingsRate()}%.`
    }
    
    if (lowerQuery.includes('spending') || lowerQuery.includes('pattern')) {
      const topCategory = getTopSpendingCategory()
      return `Your spending analysis shows:
      
• **Top category**: ${topCategory.name} (${topCategory.percentage}% of total)
• **Monthly average**: $${getMonthlyAverage()}
• **Trend**: ${getSpendingTrend()}

Consider setting a budget for ${topCategory.name} to better control expenses.`
    }
    
    if (lowerQuery.includes('budget')) {
      const budgetStatus = getBudgetStatus()
      return `Budget Status:
      
${budgetStatus.map(item => `• **${item.category}**: $${item.spent} / $${item.limit} (${item.percentage}%)`).join('\n')}

${budgetStatus.some(item => item.percentage > 100) ? '⚠️ You\'re over budget in some categories!' : '✅ You\'re doing well with your budget!'}`
    }
    
    return `I'd be happy to help with your financial questions! Here are some insights:

• **Total transactions**: ${transactions.length}
• **Active goals**: ${goals.length}
• **Budget categories**: ${budgets.length}

Feel free to ask about specific areas like savings, spending patterns, or budget management.`
  }

  const getAverageDailySpending = (): number => {
    const last30Days = transactions.filter(t => 
      new Date(t.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    const totalSpent = last30Days
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return Math.round(totalSpent / 30)
  }

  const calculateSavingsRate = (): number => {
    const last30Days = transactions.filter(t => 
      new Date(t.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    const totalIncome = last30Days
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = last30Days
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    if (totalIncome === 0) return 0
    return Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
  }

  const getTopSpendingCategory = () => {
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)
    
    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0] || ['Other', 0]
    
    return {
      name: topCategory[0],
      percentage: total > 0 ? Math.round((topCategory[1] / total) * 100) : 0
    }
  }

  const getMonthlyAverage = (): number => {
    const last30Days = transactions.filter(t => 
      new Date(t.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    const totalSpent = last30Days
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return Math.round(totalSpent)
  }

  const getSpendingTrend = (): string => {
    const last30Days = transactions.filter(t => 
      new Date(t.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    const last15Days = last30Days.filter(t => 
      new Date(t.date) >= new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    )
    
    const firstHalf = last30Days
      .filter(t => t.type === 'expense')
      .slice(0, 15)
      .reduce((sum, t) => sum + t.amount, 0)
    const secondHalf = last15Days
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    if (secondHalf > firstHalf) return 'Increasing 📈'
    if (secondHalf < firstHalf) return 'Decreasing 📉'
    return 'Stable 📊'
  }

  const getBudgetStatus = () => {
    return budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0)
      const percentage = budget.monthlyLimit > 0 ? Math.round((spent / budget.monthlyLimit) * 100) : 0
      
      return {
        category: budget.category,
        spent: Math.round(spent),
        limit: budget.monthlyLimit,
        percentage
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      generateAIResponse(query.trim())
    }
  }

  const handleQuickQuestion = (question: string) => {
    setQuery(question)
    generateAIResponse(question)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">AI Financial Advisor</h1>
        <p className="text-muted-foreground">
          Ask me anything about your finances and get personalized insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="How can I improve my financial health?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Ask
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans">{response}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
