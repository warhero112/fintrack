import React from 'react'
import { Home, BarChart3, Calendar, CreditCard, Settings, Bot, Target } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

interface BottomNavigationProps {
  isMobileView: boolean
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ isMobileView }) => {
  const { tab, setTab } = useAppStore()

  const navigationItems = [
    { id: 0, icon: Home, label: 'Home', gradient: 'from-blue-500 to-cyan-500' },
    { id: 1, icon: BarChart3, label: 'Insights', gradient: 'from-emerald-500 to-teal-500' },
    { id: 2, icon: Calendar, label: 'Calendar', gradient: 'from-purple-500 to-pink-500' },
    { id: 3, icon: CreditCard, label: 'Transactions', gradient: 'from-orange-500 to-red-500' },
    { id: 4, icon: Settings, label: 'Settings', gradient: 'from-slate-500 to-gray-500' },
    { id: 5, icon: Bot, label: 'AI Advisor', gradient: 'from-indigo-500 to-purple-500' },
    { id: 6, icon: Target, label: 'Goals', gradient: 'from-pink-500 to-rose-500' }
  ]

  if (!isMobileView) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/50 px-4 py-3 z-50">
      <div className="flex justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = tab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`group relative flex flex-col items-center py-2 px-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'scale-110' 
                  : 'hover:scale-105'
              }`}
            >
              {/* Background */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                  : 'bg-transparent group-hover:bg-slate-100'
              }`}></div>
              
              {/* Icon */}
              <div className={`relative z-10 mb-1 transition-all duration-300 ${
                isActive ? 'scale-110' : ''
              }`}>
                <Icon className={`w-6 h-6 transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                }`} />
              </div>
              
              {/* Label */}
              <span className={`relative z-10 text-xs font-semibold transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
