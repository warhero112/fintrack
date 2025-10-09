import React from 'react'
import { Menu, Bell } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

interface TopBarProps {
  title: string
}

export const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const { setSidebarOpen } = useAppStore()

  return (
    <div className="sticky top-0 z-10 bg-background rounded-2xl shadow-sm border border-border bg-card px-4 py-3 mb-3 flex items-center justify-between">
      <button
        className="hamburger-btn p-2 rounded-xl hover:bg-muted"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <button 
        className="p-2 rounded-xl hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell size={18} />
      </button>
    </div>
  )
}
