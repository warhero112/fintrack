import { useState, useEffect, createContext, useContext } from 'react';
import { 
  Home, TrendingUp, Calendar, List, Settings, Bot, Target,
  Sparkles, RefreshCw, Monitor, Smartphone, Plus, X, DollarSign,
  Pencil, Trash2, Wallet, ArrowUpRight, ArrowDownRight, Loader2,
  PieChart, BarChart3, Activity, AlertCircle, Send, Bell, Download
} from 'lucide-react';

// Context for global state
const AppContext = createContext();

function AppProvider({ children }) {
  const [tab, setTab] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('mobile');
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [settings, setSettings] = useState({
    currency: 'USD',
    theme: 'light',
    notifications: true,
    budgetAlerts: true
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fintrack-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTransactions(data.transactions || []);
        setGoals(data.goals || []);
        setBudgets(data.budgets || []);
        setSettings(data.settings || settings);
      } catch (e) {
        console.error('Failed to load data');
      }
    } else {
      // Initial sample data
      setTransactions([
        { id: '1', description: 'Monthly Salary', amount: 5000, type: 'income', category: 'Salary', date: '2025-10-01' },
        { id: '2', description: 'Grocery Shopping', amount: 150, type: 'expense', category: 'Food', date: '2025-10-05' },
        { id: '3', description: 'Electric Bill', amount: 80, type: 'expense', category: 'Utilities', date: '2025-10-08' },
        { id: '4', description: 'Freelance Project', amount: 1200, type: 'income', category: 'Freelance', date: '2025-10-10' },
        { id: '5', description: 'Restaurant Dinner', amount: 65, type: 'expense', category: 'Dining', date: '2025-10-11' }
      ]);
      setGoals([
        { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500, deadline: '2025-12-31', category: 'Savings', color: 'blue' },
        { id: '2', name: 'Vacation to Europe', targetAmount: 5000, currentAmount: 2300, deadline: '2026-06-30', category: 'Travel', color: 'purple' }
      ]);
      setBudgets([
        { id: '1', category: 'Food', limit: 500, spent: 150, period: 'monthly' },
        { id: '2', category: 'Utilities', limit: 200, spent: 80, period: 'monthly' },
        { id: '3', category: 'Dining', limit: 300, spent: 65, period: 'monthly' }
      ]);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    const data = { transactions, goals, budgets, settings };
    localStorage.setItem('fintrack-data', JSON.stringify(data));
  }, [transactions, goals, budgets, settings]);

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (id, updates) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const getTotals = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  const getMonthlyTotals = (year, month) => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  const getCategoryTotals = () => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const categoryMap = new Map();
    
    expenseTransactions.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ 
        category, 
        amount, 
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0 
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  // Goals functions
  const addGoal = (goal) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id, updates) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // Budget functions
  const addBudget = (budget) => {
    const newBudget = { ...budget, id: Date.now().toString(), spent: 0 };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id, updates) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  // Update budget spent amounts based on transactions
  useEffect(() => {
    const updatedBudgets = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    });
    setBudgets(updatedBudgets);
  }, [transactions]);

  const value = {
    tab, setTab,
    showAdd, setShowAdd,
    editingTransaction, setEditingTransaction,
    isLoading, setIsLoading,
    viewMode, setViewMode,
    transactions,
    goals,
    budgets,
    settings,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addGoal,
    updateGoal,
    deleteGoal,
    addBudget,
    updateBudget,
    deleteBudget,
    getTotals,
    getMonthlyTotals,
    getCategoryTotals
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
}

// Components
function TopBar({ onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { viewMode, setViewMode } = useAppStore();

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 font-bold text-lg">FinTrack</h1>
              <p className="text-slate-600 text-xs">Personal Finance Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh} 
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className={`w-5 h-5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')} 
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:scale-105"
            >
              {viewMode === 'mobile' ? <Smartphone className="w-5 h-5 text-slate-600" /> : <Monitor className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomNavigation() {
  const { tab, setTab } = useAppStore();
  const navItems = [
    { id: 0, icon: Home, label: 'Home' },
    { id: 1, icon: TrendingUp, label: 'Insights' },
    { id: 2, icon: Calendar, label: 'Calendar' },
    { id: 3, icon: List, label: 'Transactions' },
    { id: 6, icon: Target, label: 'Goals' },
    { id: 5, icon: Bot, label: 'AI' },
    { id: 4, icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-area-bottom shadow-lg">
      <div className="max-w-md mx-auto px-1 py-2">
        <div className="flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;
            return (
              <button 
                key={item.id} 
                onClick={() => setTab(item.id)} 
                className="flex flex-col items-center gap-1 px-2 py-2 min-w-0 flex-1 rounded-xl transition-all duration-200 hover:bg-slate-50"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-800 shadow-lg scale-105' 
                    : 'bg-transparent hover:bg-slate-100'
                }`}>
                  <Icon className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`} />
                </div>
                <span className={`text-[10px] leading-tight truncate max-w-full transition-all duration-200 font-medium ${
                  isActive ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TransactionModal() {
  const { showAdd, setShowAdd, editingTransaction, setEditingTransaction, addTransaction, updateTransaction } = useAppStore();
  const [formData, setFormData] = useState({
    description: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description,
        amount: editingTransaction.amount.toString(),
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: editingTransaction.date
      });
    } else {
      setFormData({ description: '', amount: '', type: 'expense', category: '', date: new Date().toISOString().split('T')[0] });
    }
  }, [editingTransaction]);

  const handleSubmit = () => {
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Please fill in all fields');
      return;
    }
    
    const transactionData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    setShowAdd(false);
    setEditingTransaction(null);
  };

  if (!showAdd) return null;

  const categories = ['Salary', 'Freelance', 'Investment', 'Food', 'Utilities', 'Dining', 'Entertainment', 'Shopping', 'Transportation', 'Health', 'Education', 'Other'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <div className="bg-slate-800 p-6 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
            <button 
              onClick={() => { setShowAdd(false); setEditingTransaction(null); }} 
              className="p-2 rounded-xl hover:bg-slate-700 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            <button 
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
                formData.type === 'expense' 
                  ? 'bg-rose-600 text-white shadow-lg' 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              Expense
            </button>
            <button 
              onClick={() => setFormData({ ...formData, type: 'income' })}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
                formData.type === 'income' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>
          <input 
            type="text" 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description" 
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all" 
          />
          <input 
            type="number" 
            step="0.01" 
            value={formData.amount} 
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="Amount" 
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all" 
          />
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input 
            type="date" 
            value={formData.date} 
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all" 
          />
          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => { setShowAdd(false); setEditingTransaction(null); }}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className="flex-1 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all duration-200 font-medium shadow-lg"
            >
              {editingTransaction ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeScreen() {
  const { 
    setShowAdd, getTotals, transactions, setEditingTransaction, deleteTransaction,
    getMonthlyTotals, getCategoryTotals, budgets, goals
  } = useAppStore();
  const totals = getTotals();
  const currentDate = new Date();
  const monthlyTotals = getMonthlyTotals(currentDate.getFullYear(), currentDate.getMonth());
  const categoryTotals = getCategoryTotals();
  const [hoveredId, setHoveredId] = useState(null);

  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-slate-800 p-8 text-white shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-slate-300 mb-2 font-medium">Welcome back!</p>
            <h1 className="text-white mb-2 text-3xl font-bold">Your Financial Overview</h1>
            <p className="text-slate-300">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="w-20 h-20 rounded-3xl bg-slate-700 flex items-center justify-center shadow-lg">
            <Wallet className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-slate-300 text-lg font-medium">Net Worth:</span>
          <h1 className="text-white text-4xl font-bold">{formatCurrency(totals.balance)}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-slate-100 p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-600 text-sm font-medium">Net Worth</p>
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-slate-700 text-2xl font-bold mb-3">{formatCurrency(totals.balance)}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-emerald-600">+12.5%</span>
            <span className="text-slate-500 text-xs">vs last month</span>
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-600 text-sm font-medium">Total Income</p>
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-emerald-700 text-2xl font-bold mb-3">{formatCurrency(totals.income)}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-emerald-600">+8.2%</span>
            <span className="text-slate-500 text-xs">vs last month</span>
          </div>
        </div>
        <div className="rounded-2xl bg-rose-50 p-6 border border-rose-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-600 text-sm font-medium">Total Expenses</p>
            <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg">
              <ArrowDownRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-rose-700 text-2xl font-bold mb-3">{formatCurrency(totals.expenses)}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-rose-600">-3.1%</span>
            <span className="text-slate-500 text-xs">vs last month</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Recent Transactions</h3>
          <button 
            onClick={() => setShowAdd(true)} 
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm hover:bg-slate-700 transition-all duration-200 font-medium shadow-lg"
          >
            <Plus className="w-4 h-4 inline mr-1" />Add
          </button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((transaction) => {
            const isIncome = transaction.type === 'income';
            const isHovered = hoveredId === transaction.id;
            return (
              <div 
                key={transaction.id} 
                onMouseEnter={() => setHoveredId(transaction.id)} 
                onMouseLeave={() => setHoveredId(null)}
                className="relative rounded-2xl bg-slate-50 p-4 hover:shadow-lg transition-all duration-200 group hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${isIncome ? 'bg-emerald-50' : 'bg-rose-50'} flex items-center justify-center flex-shrink-0`}>
                    <DollarSign className={`w-8 h-8 ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-slate-900 font-medium truncate">{transaction.description}</h4>
                      <span className={`${isIncome ? 'text-emerald-600' : 'text-rose-600'} font-semibold whitespace-nowrap`}>
                        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-sm">{formatDate(transaction.date)}</span>
                      <span className="text-slate-400">•</span>
                      <span className="px-2 py-1 rounded-lg text-xs bg-slate-200 text-slate-700">{transaction.category}</span>
                    </div>
                  </div>
                  {isHovered && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                      <button 
                        onClick={() => { setEditingTransaction(transaction); setShowAdd(true); }}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirm('Delete this transaction?') && deleteTransaction(transaction.id)}
                        className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Spending Chart */}
      <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Category Spending</h3>
        </div>
        <div className="space-y-3">
          {categoryTotals.slice(0, 5).map((cat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-900">{cat.category}</span>
                <span className="text-slate-600">{formatCurrency(cat.amount)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-slate-700 transition-all duration-500" 
                  style={{ width: `${cat.percentage}%` }} 
                />
              </div>
            </div>
          ))}
          {categoryTotals.length === 0 && (
            <p className="text-slate-500 text-center py-8">No spending data yet</p>
          )}
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">This Month</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div>
              <p className="text-emerald-700 text-sm">Income</p>
              <p className="text-emerald-900 text-lg font-bold">{formatCurrency(monthlyTotals.income)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <div>
              <p className="text-rose-700 text-sm">Expenses</p>
              <p className="text-rose-900 text-lg font-bold">{formatCurrency(monthlyTotals.expenses)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 border border-slate-200">
            <div>
              <p className="text-slate-700 text-sm">Net</p>
              <p className="text-slate-900 text-lg font-bold">{formatCurrency(monthlyTotals.balance)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      {budgets.length > 0 && (
        <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Budget Overview</h3>
          </div>
          <div className="space-y-4">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const isOverBudget = percentage >= 100;
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">{budget.category}</span>
                      {isOverBudget && <AlertCircle className="w-4 h-4 text-rose-500" />}
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-900">{formatCurrency(budget.spent)}</span>
                      <span className="text-slate-500"> / {formatCurrency(budget.limit)}</span>
                    </div>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={isOverBudget ? 'text-rose-600' : 'text-slate-500'}>
                      {percentage.toFixed(0)}% used
                    </span>
                    <span className={isOverBudget ? 'text-rose-600' : 'text-emerald-600'}>
                      {isOverBudget ? 'Over by ' : ''}{formatCurrency(Math.abs(budget.limit - budget.spent))} {isOverBudget ? '' : 'left'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setShowAdd(true)} 
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-200 hover:scale-105 group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <p className="text-slate-900 font-medium text-sm">Add Transaction</p>
          </button>
          <button 
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-200 hover:scale-105 group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-slate-900 font-medium text-sm">View Goals</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// AI Advisor Screen
function AIAdvisorScreen() {
  const { getTotals, transactions, goals, budgets } = useAppStore();
  const [messages, setMessages] = useState([
    { id: '1', text: "Hello! I'm your AI Financial Advisor. I can help you understand your spending patterns, set financial goals, and provide personalized advice. How can I assist you today?", sender: 'ai', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateAIResponse = (userMessage) => {
    const totals = getTotals();
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('spending') || lowerMessage.includes('expenses')) {
      const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});
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
    
    if (lowerMessage.includes('goal')) {
      if (goals.length === 0) {
        return `You haven't set any financial goals yet. Setting clear, measurable goals is a great way to stay motivated and track your progress. Would you like help setting up your first goal?`;
      }
      const goalProgress = goals.map(g => `${g.name}: ${((g.currentAmount / g.targetAmount) * 100).toFixed(0)}% complete`).join(', ');
      return `Here's your goal progress: ${goalProgress}. Keep up the momentum!`;
    }
    
    return `That's a great question! Based on your financial data, I see you have ${transactions.length} transactions, with a net worth of $${totals.balance.toLocaleString()}. Is there anything specific you'd like to know about your finances?`;
  };

  const handleSend = (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;
    
    const userMessage = { id: Date.now().toString(), text: textToSend, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse = { id: (Date.now() + 1).toString(), text: generateAIResponse(textToSend), sender: 'ai', timestamp: new Date() };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "How's my spending this month?",
    "Am I on track with my budget?",
    "What are my biggest expenses?",
    "How can I save more?",
    "Review my financial goals"
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-800 p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-white mb-1 text-2xl font-bold">AI Financial Advisor</h2>
            <p className="text-slate-300">Powered by advanced AI</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                message.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'
              }`}>
                <p className="whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-slate-300' : 'text-slate-500'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-700 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-700" />
          <p className="text-slate-600 text-sm font-medium">Quick questions:</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSend(question)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 text-left font-medium"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your finances..."
            className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-6 py-4 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-slate-800 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { tab, isLoading, setIsLoading } = useAppStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-slate-900 mb-2 font-bold text-xl">FinTrack</h2>
          <p className="text-slate-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar onRefresh={() => window.location.reload()} />
      <main className="max-w-md mx-auto px-4 pt-24 pb-32">
        <div className={`transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {tab === 0 && <HomeScreen />}
          {tab === 5 && <AIAdvisorScreen />}
          {tab !== 0 && tab !== 5 && (
            <div className="rounded-2xl bg-white p-12 border border-slate-200 text-center">
              <h3 className="text-slate-900 text-xl font-bold mb-2">
                {tab === 1 && 'Insights'}{tab === 2 && 'Calendar'}{tab === 3 && 'Transactions'}
                {tab === 4 && 'Settings'}{tab === 6 && 'Goals'}
              </h3>
              <p className="text-slate-600">This screen is available in the full codebase</p>
            </div>
          )}
        </div>
      </main>
      <BottomNavigation />
      <TransactionModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}