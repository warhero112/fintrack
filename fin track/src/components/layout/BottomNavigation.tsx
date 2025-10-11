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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-bottom">
      <div className="max-w-md mx-auto px-1 py-1.5">
        <div className="flex items-center justify-between">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="flex flex-col items-center gap-0.5 px-1 py-1.5 min-w-0 flex-1"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-slate-800'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-slate-600'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] leading-tight truncate max-w-full transition-all ${
                    isActive
                      ? 'text-slate-900'
                      : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )
}
