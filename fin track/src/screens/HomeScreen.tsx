import React from 'react'
import { Menu } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { TopBar } from '../components/layout/TopBar'
import { BalanceCards } from '../components/home/BalanceCards'
import { QuickActions } from '../components/home/QuickActions'
import { MonthlyChart } from '../components/home/MonthlyChart'
import { RecentTransactions } from '../components/home/RecentTransactions'

interface HomeScreenProps {
  isMobileView: boolean
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ isMobileView }) => {
  const { setSidebarOpen } = useAppStore()

  return (
    <div className={isMobileView ? "pb-28" : "pb-8"}>
      <TopBar 
        title="FinTrack" 
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="px-4 space-y-6">
        <BalanceCards />
        <QuickActions />
        <MonthlyChart />
        <RecentTransactions />
      </div>
    </div>
  )
}
