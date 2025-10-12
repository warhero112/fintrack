import React from 'react'
import { BalanceCards } from '../components/home/BalanceCards'
import { RecentTransactions } from '../components/home/RecentTransactions'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { TrendsChart } from '../components/analytics/TrendsChart'
import { BudgetTracker } from '../components/BudgetTracker'
import { 
  Plus, 
  PieChart, 
  TrendingUp, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  DollarSign,
  CreditCard,
  PiggyBank,
  BarChart3,
  Calendar,
  Settings,
  Sparkles
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface HomeScreenProps {
  isMobileView: boolean
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ isMobileView }) => {
  const { setShowAdd, getMonthlyTotals, getCategoryTotals, getTotals, transactions, budgets } = useAppStore()
  
  const totals = getTotals()
  const currentDate = new Date()
  const monthlyTotals = getMonthlyTotals()
  const categoryTotals = getCategoryTotals()

  // Convert categoryTotals object to array for display
  const categoryTotalsArray = Object.entries(categoryTotals || {}).map(([category, data]) => ({
    category,
    ...data
  }))

  const categoryTotalsWithPercentages = categoryTotalsArray
    .map(cat => ({
      ...cat,
      percentage: cat.expense > 0 ? Math.min((cat.expense / monthlyTotals.expense) * 100, 100) : 0
    }))
    .sort((a, b) => b.expense - a.expense)

  const quickActions = [
    { icon: Plus, label: 'Add Transaction', onClick: () => setShowAdd(true) },
    { icon: Calendar, label: 'Calendar', onClick: () => {} },
    { icon: Target, label: 'Goals', onClick: () => {} },
    { icon: Sparkles, label: 'AI Insights', onClick: () => {} }
  ]

  const stats = [
    { label: 'Monthly Income', value: `$${monthlyTotals.income.toLocaleString()}`, color: 'text-emerald-700' },
    { label: 'Monthly Expenses', value: `$${monthlyTotals.expense.toLocaleString()}`, color: 'text-rose-700' },
    { label: 'Transactions', value: (transactions?.length || 0).toString(), color: 'text-slate-700' }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-2xl bg-slate-800 p-8 text-white border border-slate-700">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-slate-300 mb-2">Welcome back!</p>
            <h1 className="text-white mb-2">Your Financial Overview</h1>
            <p className="text-slate-300">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-slate-300">Net Worth:</span>
          <h1 className="text-white">${totals.netWorth.toLocaleString()}</h1>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-2xl bg-white p-4 border border-slate-200">
            <p className="text-slate-600 text-xs mb-1">{stat.label}</p>
            <p className={stat.color}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Balance Cards */}
      <BalanceCards />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="rounded-2xl bg-white p-6 border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-900 text-sm">{action.label}</p>
            </button>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Spending */}
        <div className="rounded-2xl bg-white p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <h3>Category Spending</h3>
          </div>
          
          <div className="space-y-3">
            {categoryTotalsWithPercentages.slice(0, 5).map((cat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-900">{cat.category}</span>
                  <span className="text-slate-600">${cat.expense.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-700"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {categoryTotalsWithPercentages.length === 0 && (
              <p className="text-slate-500 text-center py-8">No spending data yet</p>
            )}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="rounded-2xl bg-white p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3>This Month</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div>
                <p className="text-emerald-700 text-sm">Income</p>
                <p className="text-emerald-900">${monthlyTotals.income.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div>
                <p className="text-rose-700 text-sm">Expenses</p>
                <p className="text-rose-900">${monthlyTotals.expense.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white rotate-180" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <div>
                <p className="text-slate-700 text-sm">Net</p>
                <p className="text-slate-900">${monthlyTotals.net.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Budget Overview */}
      <div className="rounded-2xl bg-white p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3>Budget Overview</h3>
        </div>
        <BudgetTracker />
      </div>
    </div>
  )
}