import React from 'react'
import { BalanceCards } from '../components/home/BalanceCards'
import { RecentTransactions } from '../components/home/RecentTransactions'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { TrendsChart } from '../components/analytics/TrendsChart'
import { BudgetTracker } from '../components/BudgetTracker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Separator } from '../components/ui/separator'
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
  Sparkles,
  TrendingDown
} from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface HomeScreenProps {
  isMobileView: boolean
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ isMobileView }) => {
  const { setShowAdd, getMonthlyTotals, getCategoryTotals } = useAppStore()
  
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
    {
      title: 'Add Income',
      icon: ArrowUpRight,
      color: 'bg-emerald-500',
      onClick: () => setShowAdd(true)
    },
    {
      title: 'Add Expense',
      icon: ArrowDownRight,
      color: 'bg-red-500',
      onClick: () => setShowAdd(true)
    },
    {
      title: 'View Reports',
      icon: BarChart3,
      color: 'bg-blue-500',
      onClick: () => {}
    },
    {
      title: 'Set Budget',
      icon: Target,
      color: 'bg-purple-500',
      onClick: () => {}
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good morning! 👋</h1>
          <p className="text-muted-foreground">Here's your financial overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            This Month
          </Badge>
        </div>
      </div>

      {/* Balance Cards */}
      <BalanceCards />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyTotals.income.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyTotals.expense.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyTotals.net.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common financial tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col gap-2 hover:bg-accent"
                  onClick={action.onClick}
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Spending by Category
            </CardTitle>
            <CardDescription>Your spending breakdown this month</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart />
          </CardContent>
        </Card>

        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Trends
            </CardTitle>
            <CardDescription>Income vs expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendsChart />
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Overview
          </CardTitle>
          <CardDescription>Track your spending against budget</CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetTracker />
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTransactions />
        </CardContent>
      </Card>

      {/* Add Transaction Button - Mobile */}
      {isMobileView && (
        <div className="fixed bottom-20 right-4 z-50">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  )
}