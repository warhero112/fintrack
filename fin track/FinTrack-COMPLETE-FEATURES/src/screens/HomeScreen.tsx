import React from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useAppStore } from '../stores/appStore'
import { Settings, Plus, ForkKnife, ShoppingCart, Fuel, Menu } from 'lucide-react'

export const HomeScreen: React.FC = () => {
  const { transactions, totals, monthlyData } = useTransactions()
  const { settings, setShowAdd, setSidebarOpen } = useAppStore()

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: settings.currency,
      }).format(amount)
    } catch {
      return `${settings.currency} ${amount}`
    }
  }

  const getProgressPercentage = () => {
    const budget = 1500 // Example budget
    const spent = Math.abs(totals.expenses)
    return Math.min(100, Math.round((spent / budget) * 100))
  }

  const recentTransactions = [
    {
      id: '1',
      title: 'The Italian Place',
      subtitle: 'Restaurant',
      amount: -45.00,
      icon: ForkKnife,
      color: 'bg-muted'
    },
    {
      id: '2',
      title: 'Fresh Foods Market',
      subtitle: 'Grocery Store',
      amount: -78.50,
      icon: ShoppingCart,
      color: 'bg-muted'
    },
    {
      id: '3',
      title: 'Speedy Gas',
      subtitle: 'Gas Station',
      amount: -35.00,
      icon: Fuel,
      color: 'bg-muted'
    }
  ]

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background rounded-2xl shadow-sm border border-border bg-card px-4 py-3 mb-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Overview</h1>
        <button className="p-2 rounded-xl hover:bg-muted">
          <Settings size={20} />
        </button>
      </div>

      <div className="px-4 space-y-4 max-w-md mx-auto">
        {/* This Month Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">This Month</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-muted">
              <p className="text-foreground text-base font-medium leading-normal">Spending</p>
              <p className="text-foreground tracking-light text-2xl font-bold leading-tight">{formatCurrency(Math.abs(totals.expenses))}</p>
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="space-y-3">
          <div className="flex gap-6 justify-between">
            <p className="text-foreground text-base font-medium leading-normal">Budget</p>
            <p className="text-foreground text-sm font-normal leading-normal">1500</p>
          </div>
          <div className="rounded bg-muted">
            <div className="h-2 rounded bg-primary" style={{width: `${getProgressPercentage()}%`}}></div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Quick Insights</h2>
          <div className="bg-cover bg-center flex flex-col items-stretch justify-end rounded-xl pt-[132px]" style={{
            backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvW-X3I95tRwZUVcdQMfAjYP9B2BYRyg6gdCTHown6vglcaboEzzNPaUVCKcsJgGbwYC9ZOHORq5y8BFvN4l6QpKId15_BQvN1TfirJv1m5eOeHAe84rIbhPwHF8ivl4vC782yn7IB6H2jNITdxQTGJjgcd-UQ0yHzkV8MLxh-VAvsfZbkU16tqj60t37G_yfpOhN_Ks_WQMWNQienAaDDZOplkFWGjNEzdtXHLDWnAHtKR7W0AZNnTGTNdrvAtd9hKUOMqjFsz-M")'
          }}>
            <div className="flex w-full items-end justify-between gap-4 p-4">
              <div className="flex max-w-[440px] flex-1 flex-col gap-1">
                <p className="text-white tracking-light text-2xl font-bold leading-tight max-w-[440px]">You're spending more on dining out this month</p>
                <p className="text-white text-base font-medium leading-normal">Compared to last month, your dining out expenses have increased by 15%.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Monthly Overview</h2>
          <div className="flex min-w-72 flex-1 flex-col gap-2">
            <p className="text-foreground text-base font-medium leading-normal">Spending by Category</p>
            <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
              <div className="border-border bg-muted border-t-2 w-full" style={{height: '90%'}}></div>
              <p className="text-muted-foreground text-[13px] font-bold leading-normal tracking-[0.015em]">Food</p>
              <div className="border-border bg-muted border-t-2 w-full" style={{height: '90%'}}></div>
              <p className="text-muted-foreground text-[13px] font-bold leading-normal tracking-[0.015em]">Transport</p>
              <div className="border-border bg-muted border-t-2 w-full" style={{height: '30%'}}></div>
              <p className="text-muted-foreground text-[13px] font-bold leading-normal tracking-[0.015em]">Entertainment</p>
              <div className="border-border bg-muted border-t-2 w-full" style={{height: '70%'}}></div>
              <p className="text-muted-foreground text-[13px] font-bold leading-normal tracking-[0.015em]">Utilities</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <div className="space-y-0">
            {recentTransactions.map((transaction) => {
              const Icon = transaction.icon
              return (
                <div key={transaction.id} className="flex items-center gap-4 bg-card px-4 min-h-[72px] py-2 justify-between border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className={`text-foreground flex items-center justify-center rounded-lg ${transaction.color} shrink-0 size-12`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-foreground text-base font-medium leading-normal line-clamp-1">{transaction.title}</p>
                      <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">{transaction.subtitle}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <p className="text-foreground text-base font-normal leading-normal">{formatCurrency(transaction.amount)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
