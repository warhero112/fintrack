import React from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useAppStore } from '../stores/appStore'
import { TrendingUp, TrendingDown, Menu } from 'lucide-react'

export const StatsScreen: React.FC = () => {
  const { transactions, totals } = useTransactions()
  const { settings, setSidebarOpen } = useAppStore()

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: settings.currency,
      }).format(amount)
    } catch {
      return `${settings.currency} ${amount}`
    }
  }

  const getSavingsChange = () => {
    // Mock data for demonstration
    return { amount: 1250, change: 15 }
  }

  const getSpendingChange = () => {
    // Mock data for demonstration
    return { amount: 3500, change: -5 }
  }

  const getGoalProgress = () => {
    // Mock data for demonstration
    return 75
  }

  const getBudgetStatus = () => {
    // Mock data for demonstration
    return 'On Track'
  }

  const categoryData = [
    { name: 'Food', percentage: 10 },
    { name: 'Transportation', percentage: 30 },
    { name: 'Entertainment', percentage: 100 },
    { name: 'Utilities', percentage: 60 },
    { name: 'Shopping', percentage: 70 }
  ]

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background rounded-2xl shadow-sm border border-border bg-card px-4 py-3 mb-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Insights</h1>
        <div></div>
      </div>

      <div className="px-4 space-y-4 max-w-md mx-auto">
        {/* Smart Insights */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Smart Insights</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-muted">
              <p className="text-foreground text-base font-medium leading-normal">Savings</p>
              <p className="text-foreground tracking-light text-2xl font-bold leading-tight">{formatCurrency(getSavingsChange().amount)}</p>
              <p className="text-green-600 text-base font-medium leading-normal flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{getSavingsChange().change}%
              </p>
            </div>
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-muted">
              <p className="text-foreground text-base font-medium leading-normal">Spending</p>
              <p className="text-foreground tracking-light text-2xl font-bold leading-tight">{formatCurrency(getSpendingChange().amount)}</p>
              <p className="text-red-600 text-base font-medium leading-normal flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                {getSpendingChange().change}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-border">
            <p className="text-foreground text-base font-medium leading-normal">Goal Progress</p>
            <p className="text-foreground tracking-light text-2xl font-bold leading-tight">{getGoalProgress()}%</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-border">
            <p className="text-foreground text-base font-medium leading-normal">Budget Status</p>
            <p className="text-foreground tracking-light text-2xl font-bold leading-tight">{getBudgetStatus()}</p>
          </div>
        </div>

        {/* Spending Breakdown */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Spending Breakdown</h2>
          <div className="flex min-w-72 flex-1 flex-col gap-2">
            <p className="text-foreground text-base font-medium leading-normal">Expenses by Category</p>
            <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
              {categoryData.map((category, index) => (
                <React.Fragment key={index}>
                  <p className="text-muted-foreground text-[13px] font-bold leading-normal tracking-[0.015em]">{category.name}</p>
                  <div className="h-full flex-1">
                    <div 
                      className="border-border bg-muted border-r-2 h-full" 
                      style={{width: `${category.percentage}%`}}
                    ></div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
