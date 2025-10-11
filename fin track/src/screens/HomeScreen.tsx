import React from 'react'
import { BalanceCards } from '../components/home/BalanceCards'
import { RecentTransactions } from '../components/home/RecentTransactions'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { TrendsChart } from '../components/analytics/TrendsChart'
import { BudgetTracker } from '../components/BudgetTracker'
import { Plus, TrendingUp, DollarSign, Calendar, Target, Wallet, CreditCard, PieChart } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface HomeScreenProps {
  isMobileView: boolean
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ isMobileView }) => {
  const { setShowAdd, getMonthlyTotals, getCategoryTotals } = useAppStore()
  
  const monthlyTotals = getMonthlyTotals()
  const categoryTotals = getCategoryTotals()
  
  // Convert categoryTotals object to array for display
  const categoryTotalsArray = Object.entries(categoryTotals).map(([category, data]) => ({
    category,
    amount: data.expense, // Use expense for spending display
    percentage: 0 // Will be calculated below
  }))
  
  // Calculate percentages
  const totalExpenses = categoryTotalsArray.reduce((sum, cat) => sum + cat.amount, 0)
  const categoryTotalsWithPercentages = categoryTotalsArray.map(cat => ({
    ...cat,
    percentage: totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0
  })).sort((a, b) => b.amount - a.amount)

  const quickActions = [
    {
      title: 'Add Transaction',
      icon: Plus,
      color: 'bg-slate-800',
      onClick: () => setShowAdd(true)
    },
    {
      title: 'View Calendar',
      icon: Calendar,
      color: 'bg-slate-800',
      onClick: () => {}
    },
    {
      title: 'Set Goals',
      icon: Target,
      color: 'bg-slate-800',
      onClick: () => {}
    },
    {
      title: 'View Insights',
      icon: TrendingUp,
      color: 'bg-slate-800',
      onClick: () => {}
    }
  ]

  return (
    <div className="space-y-6">
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
          <h1 className="text-white">${monthlyTotals.net.toLocaleString()}</h1>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-slate-600 text-xs mb-1">Monthly Income</p>
          <p className="text-slate-900">${monthlyTotals.income.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-slate-600 text-xs mb-1">Monthly Expenses</p>
          <p className="text-slate-900">${monthlyTotals.expense.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-slate-600 text-xs mb-1">Transactions</p>
          <p className="text-slate-900">12</p>
        </div>
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
              <p className="text-slate-900 text-sm">{action.title}</p>
            </button>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Chart */}
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
                  <span className="text-slate-600">${cat.amount.toLocaleString()}</span>
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
      <BudgetTracker />
    </div>
  )
}
