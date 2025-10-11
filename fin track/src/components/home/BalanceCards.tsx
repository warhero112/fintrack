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
      title: 'Balance',
      amount: totals.netWorth,
      color: 'blue-600',
      bgColor: 'bg-blue-50',
      icon: DollarSign,
      change: '+2.5% from last month'
    },
    {
      title: 'Income',
      amount: totals.totalIncome,
      color: 'green-600',
      bgColor: 'bg-green-50',
      icon: ArrowUpRight,
      change: '+12% from last month'
    },
    {
      title: 'Expenses',
      amount: totals.totalExpense,
      color: 'red-600',
      bgColor: 'bg-red-50',
      icon: ArrowDownRight,
      change: '-5% from last month'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color.replace('600', '600')}`} />
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium ${card.color} ${card.bgColor} px-2 py-1 rounded-full`}>
                  {card.title}
                </div>
              </div>
            </div>
            <div className={`text-3xl font-bold text-gray-900 mb-1`}>
              {formatCurrency(card.amount, currency)}
            </div>
            <div className="text-sm text-gray-500">
              {card.title === 'Balance' ? 'Net Worth' : `Total ${card.title}`}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className={`w-4 h-4 ${card.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  )
}
