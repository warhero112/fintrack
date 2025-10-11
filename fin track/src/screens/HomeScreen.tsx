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

  const quickActions = [
    {
      title: 'Add Transaction',
      icon: Plus,
      color: 'bg-blue-500',
      onClick: () => setShowAdd(true)
    },
    {
      title: 'View Calendar',
      icon: Calendar,
      color: 'bg-green-500',
      onClick: () => {}
    },
    {
      title: 'Set Goals',
      icon: Target,
      color: 'bg-purple-500',
      onClick: () => {}
    },
    {
      title: 'View Insights',
      icon: TrendingUp,
      color: 'bg-orange-500',
      onClick: () => {}
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Good morning! 👋</h1>
            <p className="text-gray-600">Here's your financial overview</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">This month</div>
            <div className="text-3xl font-bold text-gray-900">
              ${monthlyTotals.net.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Net worth</div>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <BalanceCards />

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100">
              <PieChart className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
          </div>
          <CategoryChart />
        </div>

        {/* Trends Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Monthly Trends</h2>
          </div>
          <TrendsChart />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Budget Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100">
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Budget Overview</h2>
        </div>
        <BudgetTracker />
      </div>
    </div>
  )
}
