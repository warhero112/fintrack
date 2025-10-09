import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  icon: string
  color: string
  type: 'income' | 'expense'
  isCustom: boolean
  createdAt: string
}

export interface Settings {
  theme: 'light' | 'dark' | 'system'
  currency: string
  language: string
  notifications: boolean
  autoSync: boolean
  defaultCategories: boolean
}

interface AppState {
  // UI State
  tab: number
  showAdd: boolean
  showAICategorizer: boolean
  showBillScanner: boolean
  sidebarOpen: boolean
  
  // Data
  transactions: Transaction[]
  goals: Goal[]
  budgets: Budget[]
  recurringTransactions: RecurringTransaction[]
  categories: Category[]
  settings: Settings
  
  // Filters
  searchQuery: string
  filterType: 'all' | 'income' | 'expense'
  filterDateRange: { start: string; end: string } | null
  filterCategory: string | null
  
  // Actions
  setTab: (tab: number) => void
  setShowAdd: (show: boolean) => void
  setShowAICategorizer: (show: boolean) => void
  setShowBillScanner: (show: boolean) => void
  setSidebarOpen: (open: boolean) => void
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  getTransactions: () => Transaction[]
  getFilteredTransactions: () => Transaction[]
  
  // Goal actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addToGoal: (id: string, amount: number) => void
  
  // Budget actions
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBudget: (id: string, updates: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  
  // Recurring transaction actions
  addRecurringTransaction: (transaction: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => void
  deleteRecurringTransaction: (id: string) => void
  processRecurringTransactions: () => void
  
  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // Settings actions
  updateSettings: (settings: Partial<Settings>) => void
  
  // Filter actions
  setSearchQuery: (query: string) => void
  setFilterType: (type: 'all' | 'income' | 'expense') => void
  setFilterDateRange: (range: { start: string; end: string } | null) => void
  setFilterCategory: (category: string | null) => void
  clearFilters: () => void
  
  // Export actions
  exportToCSV: () => string
  exportToJSON: () => string
  importFromCSV: (csvData: string) => void
  importFromJSON: (jsonData: string) => void
}

const defaultCategories: Category[] = [
  // Income categories
  { id: 'salary', name: 'Salary', icon: 'Briefcase', color: '#10B981', type: 'income', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: '#3B82F6', type: 'income', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'investment', name: 'Investment', icon: 'TrendingUp', color: '#8B5CF6', type: 'income', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'gift', name: 'Gift', icon: 'Gift', color: '#F59E0B', type: 'income', isCustom: false, createdAt: new Date().toISOString() },
  
  // Expense categories
  { id: 'food', name: 'Food', icon: 'Utensils', color: '#EF4444', type: 'expense', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'transport', name: 'Transport', icon: 'Car', color: '#F97316', type: 'expense', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'bills', name: 'Bills', icon: 'FileText', color: '#84CC16', type: 'expense', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: '#EC4899', type: 'expense', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: '#06B6D4', type: 'expense', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'health', name: 'Health', icon: 'Heart', color: '#DC2626', type: 'expense', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'education', name: 'Education', icon: 'BookOpen', color: '#7C3AED', type: 'expense', isCustom: false, createdAt: new Date().toISOString() },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: '#6B7280', type: 'expense', isCustom: false, createdAt: new Date().toISOString() },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // UI State
      tab: 0,
      showAdd: false,
      showAICategorizer: false,
      showBillScanner: false,
      sidebarOpen: false,
      
      // Data
      transactions: [],
      goals: [],
      budgets: [],
      recurringTransactions: [],
      categories: defaultCategories,
      settings: {
        theme: 'system',
        currency: 'USD',
        language: 'en',
        notifications: true,
        autoSync: false,
        defaultCategories: true,
      },
      
      // Filters
      searchQuery: '',
      filterType: 'all',
      filterDateRange: null,
      filterCategory: null,
      
      // UI Actions
      setTab: (tab) => set({ tab }),
      setShowAdd: (show) => set({ showAdd: show }),
      setShowAICategorizer: (show) => set({ showAICategorizer: show }),
      setShowBillScanner: (show) => set({ showBillScanner: show }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Transaction actions
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          transactions: [...state.transactions, newTransaction]
        }))
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          )
        }))
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        }))
      },
      
      getTransactions: () => get().transactions,
      
      getFilteredTransactions: () => {
        const { transactions, searchQuery, filterType, filterDateRange, filterCategory } = get()
        
        return transactions.filter((transaction) => {
          // Search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase()
            if (!transaction.description.toLowerCase().includes(query) &&
                !transaction.category.toLowerCase().includes(query)) {
              return false
            }
          }
          
          // Type filter
          if (filterType !== 'all' && transaction.type !== filterType) {
            return false
          }
          
          // Date range filter
          if (filterDateRange) {
            const transactionDate = new Date(transaction.date)
            const startDate = new Date(filterDateRange.start)
            const endDate = new Date(filterDateRange.end)
            if (transactionDate < startDate || transactionDate > endDate) {
              return false
            }
          }
          
          // Category filter
          if (filterCategory && transaction.category !== filterCategory) {
            return false
          }
          
          return true
        })
      },
      
      // Goal actions
      addGoal: (goal) => {
        const newGoal: Goal = {
          ...goal,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          goals: [...state.goals, newGoal]
        }))
      },
      
      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id
              ? { ...g, ...updates, updatedAt: new Date().toISOString() }
              : g
          )
        }))
      },
      
      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id)
        }))
      },
      
      addToGoal: (id, amount) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id
              ? { ...g, currentAmount: g.currentAmount + amount, updatedAt: new Date().toISOString() }
              : g
          )
        }))
      },
      
      // Budget actions
      addBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          budgets: [...state.budgets, newBudget]
        }))
      },
      
      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id
              ? { ...b, ...updates, updatedAt: new Date().toISOString() }
              : b
          )
        }))
      },
      
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id)
        }))
      },
      
      // Recurring transaction actions
      addRecurringTransaction: (transaction) => {
        const newTransaction: RecurringTransaction = {
          ...transaction,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          recurringTransactions: [...state.recurringTransactions, newTransaction]
        }))
      },
      
      updateRecurringTransaction: (id, updates) => {
        set((state) => ({
          recurringTransactions: state.recurringTransactions.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          )
        }))
      },
      
      deleteRecurringTransaction: (id) => {
        set((state) => ({
          recurringTransactions: state.recurringTransactions.filter((t) => t.id !== id)
        }))
      },
      
      processRecurringTransactions: () => {
        const { recurringTransactions, addTransaction } = get()
        const today = new Date().toISOString().split('T')[0]
        
        recurringTransactions.forEach((recurring) => {
          if (recurring.isActive && recurring.nextDate === today) {
            addTransaction({
              type: recurring.type,
              amount: recurring.amount,
              description: recurring.description,
              category: recurring.category,
              date: today,
            })
            
            // Calculate next date
            const nextDate = new Date(recurring.nextDate)
            switch (recurring.frequency) {
              case 'daily':
                nextDate.setDate(nextDate.getDate() + 1)
                break
              case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7)
                break
              case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1)
                break
              case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + 1)
                break
            }
            
            // Update next date
            set((state) => ({
              recurringTransactions: state.recurringTransactions.map((t) =>
                t.id === recurring.id
                  ? { ...t, nextDate: nextDate.toISOString().split('T')[0] }
                  : t
              )
            }))
          }
        })
      },
      
      // Category actions
      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          categories: [...state.categories, newCategory]
        }))
      },
      
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id
              ? { ...c, ...updates }
              : c
          )
        }))
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id)
        }))
      },
      
      // Settings actions
      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings }
        }))
      },
      
      // Filter actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),
      setFilterDateRange: (range) => set({ filterDateRange: range }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      clearFilters: () => set({
        searchQuery: '',
        filterType: 'all',
        filterDateRange: null,
        filterCategory: null,
      }),
      
      // Export actions
      exportToCSV: () => {
        const { transactions } = get()
        const headers = ['Date', 'Type', 'Amount', 'Description', 'Category']
        const rows = transactions.map(t => [
          t.date,
          t.type,
          t.amount.toString(),
          t.description,
          t.category
        ])
        return [headers, ...rows].map(row => row.join(',')).join('\n')
      },
      
      exportToJSON: () => {
        const state = get()
        return JSON.stringify({
          transactions: state.transactions,
          goals: state.goals,
          budgets: state.budgets,
          recurringTransactions: state.recurringTransactions,
          categories: state.categories,
          settings: state.settings,
        }, null, 2)
      },
      
      importFromCSV: (csvData) => {
        const lines = csvData.split('\n')
        const headers = lines[0].split(',')
        const transactions = lines.slice(1).map(line => {
          const values = line.split(',')
          return {
            type: values[1] as 'income' | 'expense',
            amount: parseFloat(values[2]) || 0,
            description: values[3] || '',
            category: values[4] || '',
            date: values[0] || new Date().toISOString().split('T')[0],
          }
        }).filter(t => t.amount > 0)
        
        transactions.forEach(transaction => {
          get().addTransaction(transaction)
        })
      },
      
      importFromJSON: (jsonData) => {
        try {
          const data = JSON.parse(jsonData)
          if (data.transactions) {
            set({ transactions: data.transactions })
          }
          if (data.goals) {
            set({ goals: data.goals })
          }
          if (data.budgets) {
            set({ budgets: data.budgets })
          }
          if (data.recurringTransactions) {
            set({ recurringTransactions: data.recurringTransactions })
          }
          if (data.categories) {
            set({ categories: data.categories })
          }
          if (data.settings) {
            set({ settings: data.settings })
          }
        } catch (error) {
          console.error('Error importing JSON:', error)
        }
      },
    }),
    {
      name: 'fintrack-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        goals: state.goals,
        budgets: state.budgets,
        recurringTransactions: state.recurringTransactions,
        categories: state.categories,
        settings: state.settings,
      }),
    }
  )
)
