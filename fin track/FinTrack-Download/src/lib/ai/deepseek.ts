import axios from 'axios'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || 'your-deepseek-api-key'

export interface FinancialInsight {
  type: 'spending_analysis' | 'budget_recommendation' | 'financial_health' | 'savings_goal' | 'debt_advice'
  title: string
  message: string
  score?: number
  recommendations?: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface TransactionData {
  id: string
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
  description: string
}

export interface FinancialData {
  transactions: TransactionData[]
  accounts: Array<{ id: string; name: string; balance: number; currency: string }>
  budgets: Array<{ category: string; limit: number; spent: number }>
  totalIncome: number
  totalExpenses: number
  netWorth: number
}

class DeepSeekAI {
  private async callDeepSeek(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are an expert financial advisor AI. Provide practical, actionable financial advice based on user data. Be concise, helpful, and encouraging. Focus on:
              - Spending pattern analysis
              - Budget optimization
              - Financial health assessment
              - Savings recommendations
              - Debt management strategies
              
              Always provide specific, actionable advice. Use emojis sparingly but effectively.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      console.error('DeepSeek API Error:', error)
      return 'Unable to connect to AI advisor. Please check your internet connection.'
    }
  }

  async analyzeSpendingPatterns(data: FinancialData): Promise<FinancialInsight> {
    const prompt = `Analyze this financial data and provide spending insights:

    Total Income: $${data.totalIncome}
    Total Expenses: $${data.totalExpenses}
    Net Worth: $${data.netWorth}
    
    Recent Transactions:
    ${data.transactions.slice(0, 10).map(t => 
      `${t.type === 'expense' ? '-' : '+'}$${t.amount} - ${t.category} (${t.description})`
    ).join('\n')}
    
    Budget Status:
    ${data.budgets.map(b => 
      `${b.category}: $${b.spent}/${b.limit} (${Math.round((b.spent/b.limit)*100)}% used)`
    ).join('\n')}
    
    Provide a concise analysis of spending patterns and 2-3 specific recommendations.`

    const analysis = await this.callDeepSeek(prompt)
    
    return {
      type: 'spending_analysis',
      title: 'Spending Pattern Analysis',
      message: analysis,
      priority: 'high',
      recommendations: this.extractRecommendations(analysis)
    }
  }

  async getBudgetRecommendations(data: FinancialData): Promise<FinancialInsight> {
    const prompt = `Based on this financial data, provide budget optimization recommendations:

    Monthly Income: $${data.totalIncome}
    Monthly Expenses: $${data.totalExpenses}
    Savings Rate: ${Math.round(((data.totalIncome - data.totalExpenses) / data.totalIncome) * 100)}%
    
    Current Budgets:
    ${data.budgets.map(b => 
      `${b.category}: $${b.limit} (currently spent: $${b.spent})`
    ).join('\n')}
    
    Suggest 3 specific budget improvements.`

    const recommendations = await this.callDeepSeek(prompt)
    
    return {
      type: 'budget_recommendation',
      title: 'Budget Optimization',
      message: recommendations,
      priority: 'medium',
      recommendations: this.extractRecommendations(recommendations)
    }
  }

  async calculateFinancialHealthScore(data: FinancialData): Promise<FinancialInsight> {
    const savingsRate = (data.totalIncome - data.totalExpenses) / data.totalIncome
    const budgetUtilization = data.budgets.reduce((acc, b) => acc + (b.spent / b.limit), 0) / data.budgets.length
    
    const prompt = `Calculate a financial health score (0-100) based on:
    
    Savings Rate: ${Math.round(savingsRate * 100)}%
    Budget Utilization: ${Math.round(budgetUtilization * 100)}%
    Net Worth: $${data.netWorth}
    Number of Accounts: ${data.accounts.length}
    
    Provide a score and brief explanation.`

    const analysis = await this.callDeepSeek(prompt)
    const score = this.extractScore(analysis)
    
    return {
      type: 'financial_health',
      title: 'Financial Health Score',
      message: analysis,
      score: score,
      priority: 'high',
      recommendations: this.extractRecommendations(analysis)
    }
  }

  async getSavingsAdvice(data: FinancialData): Promise<FinancialInsight> {
    const prompt = `Provide savings advice based on this financial situation:

    Monthly Income: $${data.totalIncome}
    Monthly Expenses: $${data.totalExpenses}
    Current Savings: $${data.netWorth}
    
    Suggest 3 specific ways to increase savings.`

    const advice = await this.callDeepSeek(prompt)
    
    return {
      type: 'savings_goal',
      title: 'Savings Optimization',
      message: advice,
      priority: 'medium',
      recommendations: this.extractRecommendations(advice)
    }
  }

  async categorizeTransaction(description: string, amount: number): Promise<string> {
    const prompt = `Categorize this transaction into one of these categories:
    Food, Transport, Shopping, Bills, Utilities, Health, Entertainment, Travel, Education, Other, Salary, Bonus
    
    Transaction: "${description}" - $${amount}
    
    Return only the category name.`

    const category = await this.callDeepSeek(prompt)
    return category.trim().replace(/[^a-zA-Z\s]/g, '') || 'Other'
  }

  private extractRecommendations(text: string): string[] {
    const recommendations = text.match(/\d+\.\s*[^.!?]+[.!?]/g) || 
                          text.match(/•\s*[^.!?]+[.!?]/g) ||
                          text.match(/-\s*[^.!?]+[.!?]/g)
    
    return recommendations ? recommendations.slice(0, 3) : []
  }

  private extractScore(text: string): number {
    const scoreMatch = text.match(/(\d+)(?:\/100|%)/)
    return scoreMatch ? parseInt(scoreMatch[1]) : 75
  }
}

export const deepSeekAI = new DeepSeekAI()
