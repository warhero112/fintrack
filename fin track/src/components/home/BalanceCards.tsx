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
  
  const totals = getTotals()
  const currency = settings?.currency || 'USD'

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Balance Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-cyan-400/50 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <DollarSign className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              BALANCE
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2 tracking-tight">
            {formatCurrency(totals.netWorth, currency)}
          </div>
          <div className="text-sm text-gray-400 font-medium">
            Net Worth
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Income Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-emerald-400/50 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              INCOME
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2 tracking-tight">
            {formatCurrency(totals.totalIncome, currency)}
          </div>
          <div className="text-sm text-gray-400 font-medium">
            Total Income
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Expenses Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-rose-400/50 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <TrendingDown className="w-6 h-6 text-rose-400" />
            </div>
            <div className="text-xs font-medium text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              EXPENSES
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-2 tracking-tight">
            {formatCurrency(totals.totalExpense, currency)}
          </div>
          <div className="text-sm text-gray-400 font-medium">
            Total Expenses
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  )
}
