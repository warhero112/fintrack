import { Transaction, Goal, Budget } from '../types'

export interface FinancialPrediction {
  type: 'spending' | 'saving' | 'budget' | 'goal'
  prediction: number
  confidence: number
  timeframe: string
  description: string
  recommendations: string[]
}

export interface SpendingPrediction {
  nextMonth: number
  nextQuarter: number
  nextYear: number
  confidence: number
  trend: 'increasing' | 'decreasing' | 'stable'
  factors: string[]
}

export interface GoalPrediction {
  goalId: string
  currentProgress: number
  predictedCompletionDate: string
  confidence: number
  requiredMonthlyContribution: number
  isOnTrack: boolean
}

export const predictSpending = (transactions: Transaction[]): SpendingPrediction => {
  const now = new Date()
  const last6Months = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000)
    return transactionDate >= sixMonthsAgo && t.type === 'expense'
  })

  if (last6Months.length === 0) {
    return {
      nextMonth: 0,
      nextQuarter: 0,
      nextYear: 0,
      confidence: 0,
      trend: 'stable',
      factors: ['No historical data available']
    }
  }

  // Group by month
  const monthlySpending = last6Months.reduce((acc, transaction) => {
    const month = transaction.date.slice(0, 7) // YYYY-MM
    acc[month] = (acc[month] || 0) + transaction.amount
    return acc
  }, {} as Record<string, number>)

  const monthlyAmounts = Object.values(monthlySpending).sort((a, b) => a - b)
  const averageMonthly = monthlyAmounts.reduce((sum, amount) => sum + amount, 0) / monthlyAmounts.length
  
  // Calculate trend
  const sortedMonths = Object.keys(monthlySpending).sort()
  const firstHalf = sortedMonths.slice(0, Math.floor(sortedMonths.length / 2))
  const secondHalf = sortedMonths.slice(Math.floor(sortedMonths.length / 2))
  
  const firstHalfAvg = firstHalf.reduce((sum, month) => sum + (monthlySpending[month] || 0), 0) / firstHalf.length
  const secondHalfAvg = secondHalf.reduce((sum, month) => sum + (monthlySpending[month] || 0), 0) / secondHalf.length
  
  const trend = secondHalfAvg > firstHalfAvg * 1.1 ? 'increasing' :
               secondHalfAvg < firstHalfAvg * 0.9 ? 'decreasing' : 'stable'
  
  // Predictions with trend adjustment
  const trendMultiplier = trend === 'increasing' ? 1.05 : trend === 'decreasing' ? 0.95 : 1.0
  
  const nextMonth = Math.round(averageMonthly * trendMultiplier)
  const nextQuarter = Math.round(nextMonth * 3)
  const nextYear = Math.round(nextMonth * 12)
  
  // Confidence based on data consistency
  const variance = calculateVariance(monthlyAmounts)
  const confidence = Math.max(0, Math.min(100, 100 - variance * 10))
  
  const factors = []
  if (trend === 'increasing') factors.push('Spending trend is increasing')
  if (trend === 'decreasing') factors.push('Spending trend is decreasing')
  if (confidence < 70) factors.push('High spending variability detected')
  if (monthlyAmounts.length < 3) factors.push('Limited historical data')
  
  return {
    nextMonth,
    nextQuarter,
    nextYear,
    confidence: Math.round(confidence),
    trend,
    factors
  }
}

export const predictGoalCompletion = (goals: Goal[], transactions: Transaction[]): GoalPrediction[] => {
  return goals.map(goal => {
    const progress = goal.currentAmount / goal.targetAmount
    const remaining = goal.targetAmount - goal.currentAmount
    
    // Calculate historical monthly contributions to this goal
    const goalTransactions = transactions.filter(t => 
      t.description.toLowerCase().includes(goal.title.toLowerCase()) ||
      t.category === goal.category
    )
    
    const monthlyContributions = goalTransactions.reduce((acc, t) => {
      const month = t.date.slice(0, 7)
      acc[month] = (acc[month] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
    
    const avgMonthlyContribution = Object.values(monthlyContributions).length > 0
      ? Object.values(monthlyContributions).reduce((sum, amount) => sum + amount, 0) / Object.values(monthlyContributions).length
      : remaining / 12 // Default to 12 months if no history
    
    const requiredMonthlyContribution = remaining / Math.max(1, monthsUntilTarget(goal.targetDate))
    const isOnTrack = avgMonthlyContribution >= requiredMonthlyContribution * 0.8
    
    const predictedCompletionDate = isOnTrack 
      ? calculatePredictedDate(goal.currentAmount, goal.targetAmount, avgMonthlyContribution)
      : goal.targetDate
    
    const confidence = Math.min(100, Math.max(0, 100 - Math.abs(avgMonthlyContribution - requiredMonthlyContribution) / requiredMonthlyContribution * 50))
    
    return {
      goalId: goal.id,
      currentProgress: Math.round(progress * 100),
      predictedCompletionDate,
      confidence: Math.round(confidence),
      requiredMonthlyContribution: Math.round(requiredMonthlyContribution),
      isOnTrack
    }
  })
}

export const predictBudgetOverspend = (budgets: Budget[], transactions: Transaction[]): Array<{
  budgetId: string
  category: string
  currentSpent: number
  monthlyLimit: number
  predictedOverspend: number
  confidence: number
  recommendations: string[]
}> => {
  const now = new Date()
  const currentMonth = now.toISOString().slice(0, 7)
  
  return budgets.map(budget => {
    const monthlyTransactions = transactions.filter(t => 
      t.date.startsWith(currentMonth) && 
      t.type === 'expense' && 
      t.category === budget.category
    )
    
    const currentSpent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0)
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const daysPassed = now.getDate()
    const daysRemaining = daysInMonth - daysPassed
    
    // Predict based on current spending rate
    const dailyAverage = currentSpent / daysPassed
    const predictedTotal = currentSpent + (dailyAverage * daysRemaining)
    const predictedOverspend = Math.max(0, predictedTotal - budget.monthlyLimit)
    
    const confidence = daysPassed > 7 ? Math.min(100, 100 - Math.abs(predictedTotal - budget.monthlyLimit) / budget.monthlyLimit * 20) : 50
    
    const recommendations = []
    if (predictedOverspend > 0) {
      recommendations.push(`Reduce daily spending by $${Math.round(predictedOverspend / daysRemaining)} to stay within budget`)
      recommendations.push('Consider moving some expenses to next month')
    } else {
      recommendations.push('You\'re on track to stay within budget')
    }
    
    return {
      budgetId: budget.id,
      category: budget.category,
      currentSpent: Math.round(currentSpent),
      monthlyLimit: budget.monthlyLimit,
      predictedOverspend: Math.round(predictedOverspend),
      confidence: Math.round(confidence),
      recommendations
    }
  })
}

// Helper functions
const calculateVariance = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length
  return Math.sqrt(variance) / mean
}

const monthsUntilTarget = (targetDate: string): number => {
  const target = new Date(targetDate)
  const now = new Date()
  const diffTime = target.getTime() - now.getTime()
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)))
}

const calculatePredictedDate = (current: number, target: number, monthlyContribution: number): string => {
  const remaining = target - current
  const monthsNeeded = Math.ceil(remaining / monthlyContribution)
  const predictedDate = new Date()
  predictedDate.setMonth(predictedDate.getMonth() + monthsNeeded)
  return predictedDate.toISOString().split('T')[0]
}
