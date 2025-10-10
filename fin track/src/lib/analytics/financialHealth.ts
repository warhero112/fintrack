import { Transaction, Goal, Budget } from '../types'

export interface FinancialHealthScore {
  overall: number
  categories: {
    spending: number
    saving: number
    budgeting: number
    debt: number
    emergency: number
  }
  recommendations: string[]
  trends: {
    spending: 'increasing' | 'decreasing' | 'stable'
    saving: 'increasing' | 'decreasing' | 'stable'
    budgeting: 'improving' | 'declining' | 'stable'
  }
}

export const calculateFinancialHealth = (
  transactions: Transaction[],
  goals: Goal[],
  budgets: Budget[]
): FinancialHealthScore => {
  const now = new Date()
  const last30Days = transactions.filter(t => 
    new Date(t.date) >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  )

  // Calculate spending score (0-100)
  const spendingScore = calculateSpendingScore(last30Days, budgets)
  
  // Calculate saving score (0-100)
  const savingScore = calculateSavingScore(last30Days, goals)
  
  // Calculate budgeting score (0-100)
  const budgetingScore = calculateBudgetingScore(budgets, last30Days)
  
  // Calculate debt score (0-100) - simplified for now
  const debtScore = calculateDebtScore(last30Days)
  
  // Calculate emergency fund score (0-100)
  const emergencyScore = calculateEmergencyScore(goals, last30Days)

  const overall = Math.round((spendingScore + savingScore + budgetingScore + debtScore + emergencyScore) / 5)

  return {
    overall,
    categories: {
      spending: spendingScore,
      saving: savingScore,
      budgeting: budgetingScore,
      debt: debtScore,
      emergency: emergencyScore
    },
    recommendations: generateRecommendations({
      spending: spendingScore,
      saving: savingScore,
      budgeting: budgetingScore,
      debt: debtScore,
      emergency: emergencyScore
    }),
    trends: calculateTrends(transactions, goals, budgets)
  }
}

const calculateSpendingScore = (transactions: Transaction[], budgets: Budget[]): number => {
  const expenses = transactions.filter(t => t.type === 'expense')
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
  
  // Check if within budget
  const budgetTotal = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0)
  const budgetUsed = budgets.reduce((sum, b) => {
    const spent = expenses
      .filter(t => t.category === b.category)
      .reduce((s, t) => s + t.amount, 0)
    return sum + Math.min(spent, b.monthlyLimit)
  }, 0)
  
  if (budgetTotal === 0) return 50 // Neutral if no budgets set
  
  const budgetUtilization = budgetUsed / budgetTotal
  return Math.max(0, Math.min(100, 100 - (budgetUtilization - 0.8) * 200))
}

const calculateSavingScore = (transactions: Transaction[], goals: Goal[]): number => {
  const income = transactions.filter(t => t.type === 'income')
  const expenses = transactions.filter(t => t.type === 'expense')
  
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
  
  if (totalIncome === 0) return 0
  
  const savingsRate = (totalIncome - totalExpenses) / totalIncome
  
  // Score based on savings rate
  if (savingsRate >= 0.2) return 100
  if (savingsRate >= 0.15) return 90
  if (savingsRate >= 0.10) return 80
  if (savingsRate >= 0.05) return 60
  if (savingsRate >= 0) return 40
  return 0
}

const calculateBudgetingScore = (budgets: Budget[], transactions: Transaction[]): number => {
  if (budgets.length === 0) return 30 // Low score if no budgets
  
  const expenses = transactions.filter(t => t.type === 'expense')
  let totalScore = 0
  
  budgets.forEach(budget => {
    const spent = expenses
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const utilization = spent / budget.monthlyLimit
    
    if (utilization <= 0.8) totalScore += 100
    else if (utilization <= 1.0) totalScore += 80
    else if (utilization <= 1.2) totalScore += 60
    else totalScore += 20
  })
  
  return Math.round(totalScore / budgets.length)
}

const calculateDebtScore = (transactions: Transaction[]): number => {
  // Simplified debt calculation - in real app, you'd track debt accounts
  const debtPayments = transactions.filter(t => 
    t.description.toLowerCase().includes('debt') ||
    t.description.toLowerCase().includes('loan') ||
    t.description.toLowerCase().includes('credit')
  )
  
  if (debtPayments.length === 0) return 100 // No debt payments = good score
  
  // This is simplified - real implementation would track debt balances
  return 70 // Neutral score for now
}

const calculateEmergencyScore = (goals: Goal[], transactions: Transaction[]): number => {
  const emergencyGoals = goals.filter(g => 
    g.category === 'emergency' || 
    g.title.toLowerCase().includes('emergency')
  )
  
  if (emergencyGoals.length === 0) return 30 // Low score if no emergency fund
  
  const totalEmergencyTarget = emergencyGoals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalEmergencySaved = emergencyGoals.reduce((sum, g) => sum + g.currentAmount, 0)
  
  if (totalEmergencyTarget === 0) return 30
  
  const progress = totalEmergencySaved / totalEmergencyTarget
  return Math.round(progress * 100)
}

const generateRecommendations = (scores: Record<string, number>): string[] => {
  const recommendations: string[] = []
  
  if (scores.spending < 60) {
    recommendations.push('Consider reducing discretionary spending and setting stricter budgets')
  }
  
  if (scores.saving < 60) {
    recommendations.push('Try to save at least 10-20% of your income each month')
  }
  
  if (scores.budgeting < 60) {
    recommendations.push('Set up monthly budgets for all major spending categories')
  }
  
  if (scores.debt < 80) {
    recommendations.push('Focus on paying down high-interest debt as a priority')
  }
  
  if (scores.emergency < 60) {
    recommendations.push('Build an emergency fund covering 3-6 months of expenses')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Great job! Your financial health is looking strong. Keep it up!')
  }
  
  return recommendations
}

const calculateTrends = (
  transactions: Transaction[],
  goals: Goal[],
  budgets: Budget[]
): FinancialHealthScore['trends'] => {
  const now = new Date()
  const last60Days = transactions.filter(t => 
    new Date(t.date) >= new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  )
  
  const first30Days = last60Days.filter(t => 
    new Date(t.date) < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  )
  const last30Days = last60Days.filter(t => 
    new Date(t.date) >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  )
  
  // Calculate spending trend
  const first30Spending = first30Days
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const last30Spending = last30Days
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const spendingTrend = last30Spending > first30Spending * 1.1 ? 'increasing' :
                       last30Spending < first30Spending * 0.9 ? 'decreasing' : 'stable'
  
  // Calculate saving trend
  const first30Income = first30Days
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const last30Income = last30Days
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const first30Savings = first30Income - first30Spending
  const last30Savings = last30Income - last30Spending
  
  const savingTrend = last30Savings > first30Savings * 1.1 ? 'increasing' :
                     last30Savings < first30Savings * 0.9 ? 'decreasing' : 'stable'
  
  // Calculate budgeting trend (simplified)
  const budgetingTrend = 'stable' // Would need more complex logic
  
  return {
    spending: spendingTrend,
    saving: savingTrend,
    budgeting: budgetingTrend
  }
}
