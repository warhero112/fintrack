import React from 'react'
import { useAppStore } from '../../stores/appStore'
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet
} from 'lucide-react'

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export const BalanceCards: React.FC = () => {
  const { getTotals, settings } = useAppStore()
  
  const totals = getTotals()
  const currency = settings?.currency || 'USD'

  const cards = [
    {
      title: 'Total Balance',
      amount: totals.netWorth,
      icon: Wallet,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100'
    },
    {
      title: 'Total Income',
      amount: totals.totalIncome,
      icon: ArrowUpRight,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Expenses',
      amount: totals.totalExpense,
      icon: ArrowDownRight,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <div key={index} className="rounded-2xl bg-white p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="text-right">
                <p className="text-slate-600 text-sm">{card.title}</p>
              </div>
            </div>
            <div className={`text-3xl font-bold ${card.color} mb-1`}>
              {formatCurrency(card.amount, currency)}
            </div>
            <div className="text-sm text-slate-500">
              {card.title === 'Total Balance' ? 'Net Worth' : `Total ${card.title.split(' ')[1]}`}
            </div>
          </div>
        );
      })}
    </div>
  )
}