import React from 'react'
import { Home, BarChart3, Calendar, CreditCard, Settings, Bot, Target } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

interface BottomNavigationProps {
  isMobileView: boolean
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ isMobileView }) => {
  const { tab, setTab } = useAppStore()

  const navigationItems = [
    { id: 0, icon: Home, label: 'Home', color: 'text-blue-600' },
    { id: 1, icon: BarChart3, label: 'Insights', color: 'text-green-600' },
    { id: 2, icon: Calendar, label: 'Calendar', color: 'text-purple-600' },
    { id: 3, icon: CreditCard, label: 'Transactions', color: 'text-orange-600' },
    { id: 4, icon: Settings, label: 'Settings', color: 'text-gray-600' },
    { id: 5, icon: Bot, label: 'AI Advisor', color: 'text-indigo-600' },
    { id: 6, icon: Target, label: 'Goals', color: 'text-pink-600' }
  ]

  if (!isMobileView) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = tab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? `${item.color} bg-gray-50` 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
