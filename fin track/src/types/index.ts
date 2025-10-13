// Core application types
export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  category: string
  monthlyLimit: number
  currentSpent: number
  month: string
  year: number
  createdAt: string
  updatedAt: string
}

export interface RecurringTransaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  nextDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
  isCustom: boolean
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  currency: string
  language: string
  notifications: boolean
  autoSync: boolean
  dateFormat: string
  timeFormat: '12h' | '24h'
}

// Chart types
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

export interface TimeSeriesDataPoint {
  month: string
  income: number
  expenses: number
  net: number
}

export interface TooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color?: string
    dataKey: string
  }>
  label?: string
}

// Component prop types
export interface ViewModeToggleProps {
  viewMode: 'auto' | 'mobile' | 'desktop'
  setViewMode: (mode: 'auto' | 'mobile' | 'desktop') => void
}

export interface DesktopNavProps {
  isMobileView: boolean
}

export interface BottomNavigationProps {
  isMobileView: boolean
}

export interface TopBarProps {
  title: string
  onMenuClick?: () => void
  viewMode?: 'auto' | 'mobile' | 'desktop'
  setViewMode?: (mode: 'auto' | 'mobile' | 'desktop') => void
  showViewToggle?: boolean
}

// Screen component props
export interface ScreenProps {
  isMobileView: boolean
}

// Modal props
export interface ModalProps {
  onClose: () => void
}

export interface AddTransactionModalProps extends ModalProps {
  editingTransaction?: Transaction | null
}

// Store types
export interface AppStore {
  // State
  transactions: Transaction[]
  goals: Goal[]
  budgets: Budget[]
  recurringTransactions: RecurringTransaction[]
  categories: Category[]
  settings: AppSettings
  tab: number
  showAdd: boolean
  showAICategorizer: boolean
  showBillScanner: boolean
  searchQuery: string
  filterType: 'all' | 'income' | 'expense'
  filterDateRange: { start: string; end: string } | null
  filterCategory: string | null

  // Actions
  setTab: (tab: number) => void
  setShowAdd: (show: boolean) => void
  setShowAICategorizer: (show: boolean) => void
  setShowBillScanner: (show: boolean) => void
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  getFilteredTransactions: () => Transaction[]
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addToGoal: (id: string, amount: number) => void
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBudget: (id: string, updates: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => void
  deleteRecurringTransaction: (id: string) => void
  processRecurringTransactions: () => void
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  setSearchQuery: (query: string) => void
  setFilterType: (type: 'all' | 'income' | 'expense') => void
  setFilterDateRange: (range: { start: string; end: string } | null) => void
  setFilterCategory: (category: string | null) => void
  clearFilters: () => void
  exportToCSV: () => string
  exportToJSON: () => string
  importFromCSV: (data: string) => void
  importFromJSON: (data: string) => void
}

// Utility types
export type ViewMode = 'auto' | 'mobile' | 'desktop'
export type TransactionType = 'income' | 'expense'
export type GoalPriority = 'low' | 'medium' | 'high'
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'
export type Theme = 'light' | 'dark' | 'system'
export type TimeFormat = '12h' | '24h'
