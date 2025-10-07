import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, Account, Budget, Settings, ScannedData } from '../types'

interface AppStore {
  // UI State
  tab: number
  setTab: (tab: number) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  showAdd: boolean
  setShowAdd: (show: boolean) => void
  showAICategorizer: boolean
  setShowAICategorizer: (show: boolean) => void
  showBillScanner: boolean
  setShowBillScanner: (show: boolean) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void

  // Data State
  transactions: Transaction[]
  accounts: Account[]
  budgets: Budget[]
  settings: Settings
  categories: string[]

  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAccount: (id: string, account: Partial<Account>) => void
  deleteAccount: (id: string) => void
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBudget: (id: string, budget: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  updateSettings: (settings: Partial<Settings>) => void
  addCategory: (category: string) => void
  removeCategory: (category: string) => void

  // Computed values
  getTotals: () => { income: number; expenses: number; balance: number }
  getTransactionsByCategory: () => Record<string, number>
  getMonthlySeries: () => Array<{ day: string; income: number; expense: number }>
}

const defaultSettings: Settings = {
  currency: 'USD',
  theme: 'system',
  name: 'FinTrack User',
  locale: 'en',
  language: 'English',
  notifications: true,
  autoSync: true,
}

const defaultCategories = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Utilities',
  'Health', 'Entertainment', 'Travel', 'Education', 'Other',
  'Salary', 'Bonus'
]

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // UI State
      tab: 0,
      setTab: (tab) => set({ tab }),
      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      showAdd: false,
      setShowAdd: (showAdd) => set({ showAdd }),
      showAICategorizer: false,
      setShowAICategorizer: (showAICategorizer) => set({ showAICategorizer }),
      showBillScanner: false,
      setShowBillScanner: (showBillScanner) => set({ showBillScanner }),
      loading: false,
      setLoading: (loading) => set({ loading }),
      error: null,
      setError: (error) => set({ error }),

      // Data State
      transactions: [],
      accounts: [
        { id: 'acc1', name: 'Main Wallet', balance: 152340.12, currency: 'USD', type: 'checking' },
        { id: 'acc2', name: 'Savings', balance: 540000, currency: 'USD', type: 'savings' },
      ],
      budgets: [
        { id: 'budget1', category: 'Food', limit: 500, spent: 62.80, period: 'monthly' },
        { id: 'budget2', category: 'Transport', limit: 200, spent: 120, period: 'monthly' },
      ],
      settings: defaultSettings,
      categories: defaultCategories,

      // Actions
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Math.random().toString(36).slice(2, 10),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          transactions: [newTransaction, ...state.transactions]
        }))
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          )
        }))
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        }))
      },

      addAccount: (account) => {
        const newAccount: Account = {
          ...account,
          id: Math.random().toString(36).slice(2, 10),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          accounts: [...state.accounts, newAccount]
        }))
      },

      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
          )
        }))
      },

      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id)
        }))
      },

      addBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: Math.random().toString(36).slice(2, 10),
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
            b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
          )
        }))
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id)
        }))
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }))
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category]
        }))
      },

      removeCategory: (category) => {
        set((state) => ({
          categories: state.categories.filter((c) => c !== category)
        }))
      },

      // Computed values
      getTotals: () => {
        const { transactions, accounts } = get()
        const income = transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
        const expenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
        const balance = accounts.reduce((sum, a) => sum + a.balance, 0) + income - expenses
        return { income, expenses, balance }
      },

      getTransactionsByCategory: () => {
        const { transactions } = get()
        const categoryMap: Record<string, number> = {}
        transactions
          .filter((t) => t.type === 'expense')
          .forEach((t) => {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
          })
        return categoryMap
      },

      getMonthlySeries: () => {
        const { transactions } = get()
        const dayMap: Record<string, { income: number; expense: number }> = {}
        
        transactions.forEach((t) => {
          const day = t.date.slice(8, 10)
          if (!dayMap[day]) {
            dayMap[day] = { day, income: 0, expense: 0 }
          }
          if (t.type === 'income') {
            dayMap[day].income += t.amount
          } else {
            dayMap[day].expense += t.amount
          }
        })
        
        return Object.values(dayMap).sort((a, b) => a.day.localeCompare(b.day))
      },
    }),
    {
      name: 'fintrack-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        accounts: state.accounts,
        budgets: state.budgets,
        settings: state.settings,
        categories: state.categories,
      }),
    }
  )
)
