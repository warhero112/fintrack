import React from 'react'
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
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-2xl shadow-sm border border-border bg-card p-4 w-full">
        <div className="text-sm text-muted-foreground">Balance</div>
        <div className="text-2xl font-semibold mt-1 text-foreground">
          {formatCurrency(totals.netWorth, currency)}
        </div>
      </div>
      <div className="rounded-2xl shadow-sm border border-border bg-card p-4 w-full">
        <div className="text-sm text-muted-foreground">Income</div>
        <div className="text-2xl font-semibold mt-1 text-foreground">
          {formatCurrency(totals.totalIncome, currency)}
        </div>
      </div>
      <div className="rounded-2xl shadow-sm border border-border bg-card p-4 w-full">
        <div className="text-sm text-muted-foreground">Expenses</div>
        <div className="text-2xl font-semibold mt-1 text-foreground">
          {formatCurrency(totals.totalExpense, currency)}
        </div>
      </div>
    </div>
  )
}
