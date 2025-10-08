import React from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { useAppStore } from '../stores/appStore'
import { TopBar } from '../components/layout/TopBar'
import { BalanceCards } from '../components/home/BalanceCards'
import { MonthlyChart } from '../components/home/MonthlyChart'
import { RecentTransactions } from '../components/home/RecentTransactions'
import { QuickActions } from '../components/home/QuickActions'

export const HomeScreen: React.FC = () => {
  const { transactions, totals, monthlyData } = useTransactions()
  const { settings } = useAppStore()

  return (
    <div className="pb-28">
      <TopBar title="FinTrack" />
      <div className="px-4 space-y-4 max-w-md mx-auto">
        <BalanceCards totals={totals} currency={settings.currency} />
        <MonthlyChart data={monthlyData} />
        <QuickActions />
        <RecentTransactions 
          transactions={transactions.slice(0, 5)} 
          currency={settings.currency} 
        />
      </div>
    </div>
  )
}
