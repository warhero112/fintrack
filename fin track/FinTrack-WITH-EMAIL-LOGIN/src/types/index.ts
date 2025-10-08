export interface Transaction {
  id: string
  amount: number
  label: string
  category: string
  type: 'income' | 'expense'
  date: string
  accountId: string
  createdAt?: string
  updatedAt?: string
}

export interface Account {
  id: string
  name: string
  balance: number
  currency: string
  type: 'checking' | 'savings' | 'credit' | 'investment'
  createdAt?: string
  updatedAt?: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'weekly' | 'monthly' | 'yearly'
  createdAt?: string
  updatedAt?: string
}

export interface Settings {
  currency: string
  theme: 'light' | 'dark' | 'system'
  name: string
  locale: string
  language: string
  notifications: boolean
  autoSync: boolean
}

export interface ScannedData {
  amount?: number
  merchant?: string
  date?: string
  category?: string
  confidence: number
  rawText: string
}

export interface FinancialInsight {
  type: 'spending_analysis' | 'budget_recommendation' | 'financial_health' | 'savings_goal' | 'debt_advice'
  title: string
  message: string
  score?: number
  recommendations?: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface FinancialData {
  transactions: Transaction[]
  accounts: Account[]
  budgets: Budget[]
  totalIncome: number
  totalExpenses: number
  netWorth: number
}

export interface AppState {
  // UI State
  tab: number
  sidebarOpen: boolean
  showAdd: boolean
  showAICategorizer: boolean
  showBillScanner: boolean
  loading: boolean
  error: string | null
  
  // Data State
  transactions: Transaction[]
  accounts: Account[]
  budgets: Budget[]
  settings: Settings
  categories: string[]
  
  // Computed State
  totals: {
    income: number
    expenses: number
    balance: number
  }
}
