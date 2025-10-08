import React from 'react'
import { Home, Trophy, BarChart3, Plus, Brain, Settings } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

export const BottomNavigation: React.FC = () => {
  const { tab, setTab, setShowAdd } = useAppStore()

  const navItems = [
    { icon: Home, label: 'Home', index: 0 },
    { icon: Trophy, label: 'Goals', index: 6 },
    { icon: BarChart3, label: 'Insights', index: 1 },
    { icon: Brain, label: 'AI Advisor', index: 5 },
    { icon: Settings, label: 'Settings', index: 4 },
  ]

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.index === 2) { // Add button
      setShowAdd(true)
    } else {
      setTab(item.index)
    }
  }

  return (
    <div className="sticky bottom-0 w-full bg-white pb-3 pt-2">
      {/* Add Transaction Button */}
      <div className="px-4">
        <button 
          onClick={() => setShowAdd(true)}
          className="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-[#111418] text-white"
        >
          <p className="text-base font-bold leading-normal tracking-[0.015em]">Add Transaction</p>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 border-t border-[#f0f2f4] bg-white px-4 pb-3 pt-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = tab === item.index
          
          return (
            <button
              key={item.index}
              onClick={() => handleNavClick(item)}
              className={`just flex flex-1 flex-col items-center justify-end gap-1 ${
                isActive ? 'text-[#111418]' : 'text-[#617589]'
              }`}
            >
              <div className={`flex h-8 items-center justify-center ${
                isActive ? 'text-[#111418]' : 'text-[#617589]'
              }`}>
                <Icon 
                  size={24} 
                  fill={isActive ? 'currentColor' : 'none'}
                />
              </div>
              <p className={`text-xs font-medium leading-normal tracking-[0.015em] ${
                isActive ? 'text-[#111418]' : 'text-[#617589]'
              }`}>
                {item.label}
              </p>
            </button>
          )
        })}
      </div>
      <div className="h-5 bg-white"></div>
    </div>
  )
}
