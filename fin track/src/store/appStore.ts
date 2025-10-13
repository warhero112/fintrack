import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  icon?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  color: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
}

export interface Settings {
  currency: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  budgetAlerts: boolean;
}

interface AppStore {
  tab: number;
  showAdd: boolean;
  editingTransaction: Transaction | null;
  showAICategorizer: boolean;
  showBillScanner: boolean;
  isLoading: boolean;
  viewMode: 'mobile' | 'desktop';
  transactions: Transaction[];
  goals: Goal[];
  budgets: Budget[];
  settings: Settings;
  setTab: (tab: number) => void;
  setShowAdd: (show: boolean) => void;
  setEditingTransaction: (transaction: Transaction | null) => void;
  setShowAICategorizer: (show: boolean) => void;
  setShowBillScanner: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setViewMode: (mode: 'mobile' | 'desktop') => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getTotals: () => { income: number; expenses: number; balance: number };
  getMonthlyTotals: (year: number, month: number) => { income: number; expenses: number; balance: number };
  getCategoryTotals: () => { category: string; amount: number; percentage: number }[];
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      tab: 0,
      showAdd: false,
      editingTransaction: null,
      showAICategorizer: false,
      showBillScanner: false,
      isLoading: true,
      viewMode: 'mobile',
      transactions: [
        { id: '1', description: 'Monthly Salary', amount: 5000, type: 'income', category: 'Salary', date: '2025-10-01', icon: 'Wallet' },
        { id: '2', description: 'Grocery Shopping', amount: 150, type: 'expense', category: 'Food', date: '2025-10-05', icon: 'ShoppingCart' },
        { id: '3', description: 'Electric Bill', amount: 80, type: 'expense', category: 'Utilities', date: '2025-10-08', icon: 'Zap' },
        { id: '4', description: 'Freelance Project', amount: 1200, type: 'income', category: 'Freelance', date: '2025-10-10', icon: 'Briefcase' },
        { id: '5', description: 'Restaurant Dinner', amount: 65, type: 'expense', category: 'Dining', date: '2025-10-11', icon: 'UtensilsCrossed' }
      ],
      goals: [
        { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500, deadline: '2025-12-31', category: 'Savings', color: 'blue' },
        { id: '2', name: 'Vacation to Europe', targetAmount: 5000, currentAmount: 2300, deadline: '2026-06-30', category: 'Travel', color: 'purple' },
        { id: '3', name: 'New Laptop', targetAmount: 2000, currentAmount: 1400, deadline: '2025-11-30', category: 'Electronics', color: 'emerald' }
      ],
      budgets: [
        { id: '1', category: 'Food', limit: 500, spent: 150, period: 'monthly' },
        { id: '2', category: 'Utilities', limit: 200, spent: 80, period: 'monthly' },
        { id: '3', category: 'Dining', limit: 300, spent: 65, period: 'monthly' }
      ],
      settings: { currency: 'USD', theme: 'light', notifications: true, budgetAlerts: true },
      setTab: (tab) => set({ tab }),
      setShowAdd: (show) => set({ showAdd: show }),
      setEditingTransaction: (transaction) => set({ editingTransaction: transaction }),
      setShowAICategorizer: (show) => set({ showAICategorizer: show }),
      setShowBillScanner: (show) => set({ showBillScanner: show }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setViewMode: (mode) => set({ viewMode: mode }),
      addTransaction: (transaction) => {
        const newTransaction = { ...transaction, id: Date.now().toString() };
        set((state) => ({ transactions: [newTransaction, ...state.transactions] }));
      },
      updateTransaction: (id, updates) => {
        set((state) => ({ transactions: state.transactions.map((t) => t.id === id ? { ...t, ...updates } : t) }));
      },
      deleteTransaction: (id) => {
        set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
      },
      addGoal: (goal) => {
        const newGoal = { ...goal, id: Date.now().toString() };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },
      updateGoal: (id, updates) => {
        set((state) => ({ goals: state.goals.map((g) => g.id === id ? { ...g, ...updates } : g) }));
      },
      deleteGoal: (id) => {
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
      },
      addBudget: (budget) => {
        const newBudget = { ...budget, id: Date.now().toString(), spent: 0 };
        set((state) => ({ budgets: [...state.budgets, newBudget] }));
      },
      updateBudget: (id, updates) => {
        set((state) => ({ budgets: state.budgets.map((b) => b.id === id ? { ...b, ...updates } : b) }));
      },
      deleteBudget: (id) => {
        set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) }));
      },
      getTotals: () => {
        const { transactions } = get();
        const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { income, expenses, balance: income - expenses };
      },
      getMonthlyTotals: (year, month) => {
        const { transactions } = get();
        const monthTransactions = transactions.filter((t) => {
          const date = new Date(t.date);
          return date.getFullYear() === year && date.getMonth() === month;
        });
        const income = monthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = monthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { income, expenses, balance: income - expenses };
      },
      getCategoryTotals: () => {
        const { transactions } = get();
        const expenseTransactions = transactions.filter((t) => t.type === 'expense');
        const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
        const categoryMap = new Map<string, number>();
        expenseTransactions.forEach((t) => {
          const current = categoryMap.get(t.category) || 0;
          categoryMap.set(t.category, current + t.amount);
        });
        return Array.from(categoryMap.entries())
          .map(([category, amount]) => ({ category, amount, percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0 }))
          .sort((a, b) => b.amount - a.amount);
      }
    }),
    {
      name: 'fintrack-storage',
      partialize: (state) => ({ transactions: state.transactions, goals: state.goals, budgets: state.budgets, settings: state.settings })
    }
  )
);