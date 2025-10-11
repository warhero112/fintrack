import React from 'react'
import { Home, BarChart3, Calendar, CreditCard, Settings, Bot, Target } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

interface BottomNavigationProps {
  isMobileView: boolean
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ isMobileView }) => {
  const { tab, setTab } = useAppStore()

  const navigationItems = [
    { id: 0, icon: Home, label: 'Home' },
    { id: 1, icon: BarChart3, label: 'Insights' },
    { id: 2, icon: Calendar, label: 'Calendar' },
    { id: 3, icon: CreditCard, label: 'Transactions' },
    { id: 4, icon: Settings, label: 'Settings' },
    { id: 5, icon: Bot, label: 'AI Advisor' },
    { id: 6, icon: Target, label: 'Goals' }
  ]

  if (!isMobileView) return null

  return (
    <div className="flex gap-2 border-t border-[#f0f2f4] bg-white px-4 pb-3 pt-2">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = tab === item.id
        
        return (
          <a 
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`just flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-[#111418] ${
              isActive ? 'text-[#111418]' : 'text-[#617589]'
            }`}
            href="#"
          >
            <div className={`text-[#111418] flex h-8 items-center justify-center ${
              isActive ? 'text-[#111418]' : 'text-[#617589]'
            }`} data-icon="House" data-size="24px" data-weight="fill">
              <Icon className="w-6 h-6" />
            </div>
            <p className={`text-xs font-medium leading-normal tracking-[0.015em] ${
              isActive ? 'text-[#111418]' : 'text-[#617589]'
            }`}>
              {item.label}
            </p>
          </a>
        )
      })}
      <div className="h-5 bg-white"></div>
    </div>
  )
}
