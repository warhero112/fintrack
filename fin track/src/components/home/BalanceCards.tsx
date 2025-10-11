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
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-blue-50">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Balance
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(totals.netWorth, currency)}
        </div>
        <div className="text-sm text-gray-500">
          Net Worth
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-green-50">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
            Income
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(totals.totalIncome, currency)}
        </div>
        <div className="text-sm text-gray-500">
          Total Income
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-red-50">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
            Expenses
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(totals.totalExpense, currency)}
        </div>
        <div className="text-sm text-gray-500">
          Total Expenses
        </div>
      </div>
    </div>
  )
}
