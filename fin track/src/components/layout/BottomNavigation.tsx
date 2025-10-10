import React from 'react'
import { Home, Trophy, BarChart3, Calendar, Brain, Settings, Plus } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

interface BottomNavigationProps {
  isMobileView: boolean
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ isMobileView }) => {
  const { tab, setTab, setShowAdd } = useAppStore()

  if (!isMobileView) return null

  const navItems = [
    { icon: Home, label: 'Home', index: 0 },
    { icon: BarChart3, label: 'Insights', index: 1 },
    { icon: Calendar, label: 'Calendar', index: 2 },
    { icon: Trophy, label: 'Goals', index: 6 },
    { icon: Brain, label: 'AI', index: 5 },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border">
      <div className="mx-auto max-w-md grid grid-cols-5 py-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon
          const isActive = tab === item.index
          
          return (
            <button
              key={item.index}
              onClick={() => setTab(item.index)}
              className={`flex flex-col items-center gap-1 py-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className={`p-2 rounded-2xl ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}>
                <Icon size={20} />
              </div>
              <div className="text-[11px]">{item.label}</div>
            </button>
          )
        })}
      </div>
      
      {/* Add Transaction Button */}
      <div className="px-4 pb-2">
        <button 
          onClick={() => setShowAdd(true)}
          className="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground"
        >
          <Plus size={20} className="mb-1" />
          <p className="text-sm font-bold leading-normal tracking-[0.015em]">Add Transaction</p>
        </button>
      </div>
    </div>
  )
}
