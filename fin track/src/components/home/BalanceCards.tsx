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

  const cards = [
    {
      title: 'Net Worth',
      amount: totals.netWorth,
      color: 'slate-700',
      bgColor: 'bg-slate-100',
      icon: DollarSign,
      change: '+12.5%'
    },
    {
      title: 'Total Income',
      amount: totals.totalIncome,
      color: 'emerald-700',
      bgColor: 'bg-emerald-50',
      icon: ArrowUpRight,
      change: '+8.2%'
    },
    {
      title: 'Total Expenses',
      amount: totals.totalExpense,
      color: 'rose-700',
      bgColor: 'bg-rose-50',
      icon: ArrowDownRight,
      change: '-3.1%'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`rounded-2xl ${card.bgColor} p-6 border border-slate-200 hover:shadow-md transition-all`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600 text-sm">{card.title}</p>
              <div className={`w-10 h-10 rounded-xl bg-${card.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Amount */}
            <div className="mb-2">
              <h2 className={`text-${card.color}`}>
                {formatCurrency(card.amount, currency)}
              </h2>
            </div>

            {/* Change indicator */}
            <div className="flex items-center gap-2">
              <span className={`text-sm ${card.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {card.change}
              </span>
              <span className="text-slate-500 text-xs">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  )
}
