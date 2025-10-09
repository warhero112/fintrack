import React from 'react'
import { Home, Trophy, BarChart3, Calendar, List, Settings, Brain } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

export const BottomNavigation: React.FC = () => {
  const { tab, setTab, setShowAdd } = useAppStore()

  const navItems = [
    { icon: Home, label: 'Home', index: 0 },
    { icon: BarChart3, label: 'Insights', index: 1 },
    { icon: Calendar, label: 'Calendar', index: 2 },
    { icon: List, label: 'Transactions', index: 3 },
    { icon: Settings, label: 'Settings', index: 4 },
    { icon: Brain, label: 'AI Advisor', index: 5 },
    { icon: Trophy, label: 'Goals', index: 6 },
  ]

  const handleNavClick = (item: typeof navItems[0]) => {
    setTab(item.index)
  }

  return (
    <div className="sticky bottom-0 w-full bg-background pb-3 pt-2">
      {/* Add Transaction Button */}
      <div className="px-4">
        <button 
          onClick={() => setShowAdd(true)}
          className="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground"
        >
          <p className="text-base font-bold leading-normal tracking-[0.015em]">Add Transaction</p>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-1 border-t border-border bg-background px-2 pb-3 pt-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = tab === item.index
          
          return (
            <button
              key={item.index}
              onClick={() => handleNavClick(item)}
              className={`flex flex-1 flex-col items-center justify-end gap-1 py-2 px-1 rounded-lg transition-colors ${
                isActive ? 'text-foreground bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="flex h-6 items-center justify-center">
                <Icon 
                  size={20} 
                  fill={isActive ? 'currentColor' : 'none'}
                />
              </div>
              <p className={`text-xs font-medium leading-normal tracking-[0.015em] ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {item.label}
              </p>
            </button>
          )
        })}
      </div>
      <div className="h-5 bg-background"></div>
    </div>
  )
}
