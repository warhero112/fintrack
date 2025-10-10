import React from 'react'
import { Menu } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { TopBar } from '../components/layout/TopBar'
import FinTrackCalendar from '../components/FinTrackCalendar'

interface CalendarScreenProps {
  isMobileView: boolean
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ isMobileView }) => {
  const { setSidebarOpen } = useAppStore()

  return (
    <div className={isMobileView ? "pb-28" : "pb-8"}>
      <TopBar 
        title="Calendar" 
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="px-4 max-w-md mx-auto">
        <FinTrackCalendar />
      </div>
    </div>
  )
}
