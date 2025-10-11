import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Home, 
  Target, 
  BarChart3, 
  Sparkles, 
  Settings,
  Plus
} from 'lucide-react'

interface BottomNavigationProps {
  tab: number
  setTab: (tab: number) => void
  isMobileView: boolean
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  tab, 
  setTab, 
  isMobileView 
}) => {
  const navigationItems = [
    { id: 1, icon: Home, label: 'Home' },
    { id: 2, icon: BarChart3, label: 'Insights' },
    { id: 3, icon: Target, label: 'Goals' },
    { id: 4, icon: Sparkles, label: 'AI' },
    { id: 5, icon: Settings, label: 'Settings' }
  ]

  if (!isMobileView) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between px-4 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = tab === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary/10' 
                  : 'hover:bg-accent'
              }`}>
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}