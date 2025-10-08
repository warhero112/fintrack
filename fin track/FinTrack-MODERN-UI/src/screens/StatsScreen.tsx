import React from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useAppStore } from '../stores/appStore'
import { List, TrendingUp, TrendingDown } from 'lucide-react'

export const StatsScreen: React.FC = () => {
  const { transactions, totals } = useTransactions()
  const { settings } = useAppStore()

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
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div>
        {/* Header */}
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <div className="text-[#111418] flex size-12 shrink-0 items-center">
            <List className="w-6 h-6" />
          </div>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Insights</h2>
        </div>

        {/* Smart Insights */}
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Smart Insights</h2>
        <div className="flex flex-wrap gap-4 p-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#f0f2f4]">
            <p className="text-[#111418] text-base font-medium leading-normal">Savings</p>
            <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{formatCurrency(getSavingsChange().amount)}</p>
            <p className="text-[#078838] text-base font-medium leading-normal flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +{getSavingsChange().change}%
            </p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#f0f2f4]">
            <p className="text-[#111418] text-base font-medium leading-normal">Spending</p>
            <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{formatCurrency(getSpendingChange().amount)}</p>
            <p className="text-[#e73908] text-base font-medium leading-normal flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              {getSpendingChange().change}%
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 p-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6]">
            <p className="text-[#111418] text-base font-medium leading-normal">Goal Progress</p>
            <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{getGoalProgress()}%</p>
          </div>
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#dbe0e6]">
            <p className="text-[#111418] text-base font-medium leading-normal">Budget Status</p>
            <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{getBudgetStatus()}</p>
          </div>
        </div>

        {/* Spending Breakdown */}
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Spending Breakdown</h2>
        <div className="flex flex-wrap gap-4 px-4 py-6">
          <div className="flex min-w-72 flex-1 flex-col gap-2">
            <p className="text-[#111418] text-base font-medium leading-normal">Expenses by Category</p>
            <div className="grid min-h-[180px] gap-x-4 gap-y-6 grid-cols-[auto_1fr] items-center py-3">
              {categoryData.map((category, index) => (
                <React.Fragment key={index}>
                  <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">{category.name}</p>
                  <div className="h-full flex-1">
                    <div 
                      className="border-[#617589] bg-[#f0f2f4] border-r-2 h-full" 
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
