import React from 'react'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}

export const BalanceCards: React.FC = () => {
  const { getTotals, settings } = useAppStore()
  
  // Get totals with safety check
  const totals = getTotals()
  const currency = settings?.currency || 'USD'

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-indigo-500/10 dark:from-blue-400/20 dark:via-blue-500/10 dark:to-indigo-400/20 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-400/20">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              Balance
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            {formatCurrency(totals.netWorth, currency)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Net Worth
          </div>
        </div>
      </div>

      {/* Income Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-green-500/10 dark:from-emerald-400/20 dark:via-emerald-500/10 dark:to-green-400/20 border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/20">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              Income
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            {formatCurrency(totals.totalIncome, currency)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Total Income
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500/10 via-rose-600/5 to-red-500/10 dark:from-rose-400/20 dark:via-rose-500/10 dark:to-red-400/20 border border-rose-200/50 dark:border-rose-700/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent" />
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-rose-500/10 dark:bg-rose-400/20">
              <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-2 py-1 rounded-full">
              Expenses
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            {formatCurrency(totals.totalExpense, currency)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Total Expenses
          </div>
        </div>
      </div>
    </div>
  )
}
