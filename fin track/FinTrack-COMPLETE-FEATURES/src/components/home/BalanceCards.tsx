import React from 'react'

interface BalanceCardsProps {
  totals: {
    income: number
    expenses: number
    balance: number
  }
  currency: string
}

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

export const BalanceCards: React.FC<BalanceCardsProps> = ({ totals, currency }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-2xl shadow-sm border border-border bg-card p-4 w-full">
        <div className="text-sm text-muted-foreground">Balance</div>
        <div className="text-2xl font-semibold mt-1 text-foreground">
          {formatCurrency(totals.balance, currency)}
        </div>
      </div>
      <div className="rounded-2xl shadow-sm border border-border bg-card p-4 w-full">
        <div className="text-sm text-muted-foreground">Income</div>
        <div className="text-2xl font-semibold mt-1 text-foreground">
          {formatCurrency(totals.income, currency)}
        </div>
      </div>
      <div className="rounded-2xl shadow-sm border border-border bg-card p-4 w-full">
        <div className="text-sm text-muted-foreground">Expenses</div>
        <div className="text-2xl font-semibold mt-1 text-foreground">
          {formatCurrency(-totals.expenses, currency)}
        </div>
      </div>
    </div>
  )
}
