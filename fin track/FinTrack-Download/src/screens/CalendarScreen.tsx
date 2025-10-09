import React from 'react'
import { Calendar, Menu } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import FinTrackCalendar from '../components/FinTrackCalendar'

export const CalendarScreen: React.FC = () => {
  const { setSidebarOpen } = useAppStore()

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
        <h1 className="text-lg font-semibold text-foreground">Calendar</h1>
        <div></div>
      </div>

      <div className="px-4 max-w-md mx-auto">
        <FinTrackCalendar />
      </div>
    </div>
  )
}
