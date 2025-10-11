import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-8 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="text-right">
              <div className="text-blue-100 text-sm font-medium">BALANCE</div>
              <div className="text-white/80 text-xs">Net Worth</div>
            </div>
          </div>
          <div className="text-4xl font-bold mb-2 tracking-tight">
            {formatCurrency(totals.netWorth, currency)}
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">Total Assets</span>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>

      {/* Income Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-8 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-right">
              <div className="text-emerald-100 text-sm font-medium">INCOME</div>
              <div className="text-white/80 text-xs">This Month</div>
            </div>
          </div>
          <div className="text-4xl font-bold mb-2 tracking-tight">
            {formatCurrency(totals.totalIncome, currency)}
          </div>
          <div className="flex items-center gap-2 text-emerald-100">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm font-medium">+12% from last month</span>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>

      {/* Expenses Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-red-600 p-8 text-white shadow-2xl hover:shadow-rose-500/25 transition-all duration-500 hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <div className="text-right">
              <div className="text-rose-100 text-sm font-medium">EXPENSES</div>
              <div className="text-white/80 text-xs">This Month</div>
            </div>
          </div>
          <div className="text-4xl font-bold mb-2 tracking-tight">
            {formatCurrency(totals.totalExpense, currency)}
          </div>
          <div className="flex items-center gap-2 text-rose-100">
            <ArrowDownRight className="w-4 h-4" />
            <span className="text-sm font-medium">-5% from last month</span>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>
    </div>
  )
}
