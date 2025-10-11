import React from 'react'
import { BalanceCards } from '../components/home/BalanceCards'
import { RecentTransactions } from '../components/home/RecentTransactions'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { TrendsChart } from '../components/analytics/TrendsChart'
import { BudgetTracker } from '../components/BudgetTracker'
import { Plus, TrendingUp, DollarSign, Calendar, Target, Sparkles, Zap } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface HomeScreenProps {
  isMobileView: boolean
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ isMobileView }) => {
  const { setShowAdd, getMonthlyTotals, getCategoryTotals } = useAppStore()
  
  const monthlyTotals = getMonthlyTotals()
  const categoryTotals = getCategoryTotals()

  const quickActions = [
    {
      title: 'Add Transaction',
      icon: Plus,
      gradient: 'from-blue-500 to-cyan-500',
      onClick: () => setShowAdd(true)
    },
    {
      title: 'View Calendar',
      icon: Calendar,
      gradient: 'from-emerald-500 to-teal-500',
      onClick: () => {}
    },
    {
      title: 'Set Goals',
      icon: Target,
      gradient: 'from-purple-500 to-pink-500',
      onClick: () => {}
    },
    {
      title: 'View Insights',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      onClick: () => {}
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
              <p className="text-indigo-100 text-lg">Here's your financial overview</p>
            </div>
            <div className="text-right">
              <div className="text-indigo-200 text-sm mb-1">This month</div>
              <div className="text-4xl font-bold">
                ${monthlyTotals.net.toFixed(2)}
              </div>
              <div className="text-indigo-200 text-sm">Net worth</div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">${monthlyTotals.income.toFixed(0)}</div>
              <div className="text-indigo-200 text-sm">Income</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">${monthlyTotals.expense.toFixed(0)}</div>
              <div className="text-indigo-200 text-sm">Expenses</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-2xl font-bold">12</div>
              <div className="text-indigo-200 text-sm">Transactions</div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Balance Cards */}
      <BalanceCards />

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                {action.title}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Spending by Category</h2>
          </div>
          <CategoryChart />
        </div>

        {/* Trends Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Monthly Trends</h2>
          </div>
          <TrendsChart />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Budget Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Budget Overview</h2>
        </div>
        <BudgetTracker />
      </div>
    </div>
  )
}
