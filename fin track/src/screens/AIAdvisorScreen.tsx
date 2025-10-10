import React from 'react'
import { Menu } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { TopBar } from '../components/layout/TopBar'
import { AIFinancialAdvisor } from '../components/ai/AIFinancialAdvisor'

interface AIAdvisorScreenProps {
  isMobileView: boolean
}

export const AIAdvisorScreen: React.FC<AIAdvisorScreenProps> = ({ isMobileView }) => {
  const { setSidebarOpen } = useAppStore()

  return (
    <div className={isMobileView ? "pb-28" : "pb-8"}>
      <TopBar 
        title="AI Advisor" 
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="px-4">
        <AIFinancialAdvisor />
      </div>
    </div>
  )
}
