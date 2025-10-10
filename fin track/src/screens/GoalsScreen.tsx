import React from 'react'
import { Menu } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { TopBar } from '../components/layout/TopBar'
import { GoalsScreen as GoalsComponent } from '../components/GoalsScreen'

interface GoalsScreenProps {
  isMobileView: boolean
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({ isMobileView }) => {
  const { setSidebarOpen } = useAppStore()

  return (
    <div className={isMobileView ? "pb-28" : "pb-8"}>
      <TopBar 
        title="Goals" 
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="px-4">
        <GoalsComponent />
      </div>
    </div>
  )
}
