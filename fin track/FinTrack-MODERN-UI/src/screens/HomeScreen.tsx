import React from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useAppStore } from '../stores/appStore'
import { Settings, Plus, ForkKnife, ShoppingCart, Fuel } from 'lucide-react'

export const HomeScreen: React.FC = () => {
  const { transactions, totals, monthlyData } = useTransactions()
  const { settings, setShowAdd } = useAppStore()

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
      color: 'bg-[#f0f2f4]'
    },
    {
      id: '2',
      title: 'Fresh Foods Market',
      subtitle: 'Grocery Store',
      amount: -78.50,
      icon: ShoppingCart,
      color: 'bg-[#f0f2f4]'
    },
    {
      id: '3',
      title: 'Speedy Gas',
      subtitle: 'Gas Station',
      amount: -35.00,
      icon: Fuel,
      color: 'bg-[#f0f2f4]'
    }
  ]

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div>
        {/* Header */}
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">Overview</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#111418] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* This Month Section */}
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">This Month</h2>
        <div className="flex flex-wrap gap-4 p-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#f0f2f4]">
            <p className="text-[#111418] text-base font-medium leading-normal">Spending</p>
            <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">{formatCurrency(Math.abs(totals.expenses))}</p>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex gap-6 justify-between">
            <p className="text-[#111418] text-base font-medium leading-normal">Budget</p>
            <p className="text-[#111418] text-sm font-normal leading-normal">1500</p>
          </div>
          <div className="rounded bg-[#dbe0e6]">
            <div className="h-2 rounded bg-[#111418]" style={{width: `${getProgressPercentage()}%`}}></div>
          </div>
        </div>

        {/* Quick Insights */}
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Quick Insights</h2>
        <div className="p-4">
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
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Monthly Overview</h2>
        <div className="flex flex-wrap gap-4 px-4 py-6">
          <div className="flex min-w-72 flex-1 flex-col gap-2">
            <p className="text-[#111418] text-base font-medium leading-normal">Spending by Category</p>
            <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
              <div className="border-[#617589] bg-[#f0f2f4] border-t-2 w-full" style={{height: '90%'}}></div>
              <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">Food</p>
              <div className="border-[#617589] bg-[#f0f2f4] border-t-2 w-full" style={{height: '90%'}}></div>
              <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">Transport</p>
              <div className="border-[#617589] bg-[#f0f2f4] border-t-2 w-full" style={{height: '30%'}}></div>
              <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">Entertainment</p>
              <div className="border-[#617589] bg-[#f0f2f4] border-t-2 w-full" style={{height: '70%'}}></div>
              <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">Utilities</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Transactions</h2>
        <div className="space-y-0">
          {recentTransactions.map((transaction) => {
            const Icon = transaction.icon
            return (
              <div key={transaction.id} className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-[#111418] flex items-center justify-center rounded-lg ${transaction.color} shrink-0 size-12`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">{transaction.title}</p>
                    <p className="text-[#617589] text-sm font-normal leading-normal line-clamp-2">{transaction.subtitle}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="text-[#111418] text-base font-normal leading-normal">{formatCurrency(transaction.amount)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="sticky bottom-0 w-full bg-white pb-3 pt-2">
        <div className="px-4">
          <button 
            onClick={() => setShowAdd(true)}
            className="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-[#111418] text-white"
          >
            <p className="text-base font-bold leading-normal tracking-[0.015em]">Add Transaction</p>
          </button>
        </div>
      </div>
    </div>
  )
}
