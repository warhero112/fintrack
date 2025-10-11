import React from 'react'
import { useAppStore } from '../../stores/appStore'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  TrendingDown,
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
      trend: '+2.5%',
      trendDirection: 'up' as const,
      description: 'Your net worth',
      color: 'text-blue-600'
    },
    {
      title: 'Total Income',
      amount: totals.totalIncome,
      icon: ArrowUpRight,
      trend: '+12%',
      trendDirection: 'up' as const,
      description: 'This month',
      color: 'text-emerald-600'
    },
    {
      title: 'Total Expenses',
      amount: totals.totalExpense,
      icon: ArrowDownRight,
      trend: '+5%',
      trendDirection: 'down' as const,
      description: 'This month',
      color: 'text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendDirection === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-muted ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(card.amount, currency)}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendIcon className={`h-3 w-3 ${
                  card.trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`} />
                <span className={`text-xs font-medium ${
                  card.trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {card.trend}
                </span>
                <span className="text-xs text-muted-foreground">{card.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}