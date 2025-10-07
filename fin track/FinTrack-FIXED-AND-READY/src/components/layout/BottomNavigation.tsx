import React from 'react'
import { Home, PieChart as PieIcon, Plus, Wallet, Brain, User } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

export const BottomNavigation: React.FC = () => {
  const { tab, setTab, setShowAdd } = useAppStore()

  const navItems = [
    { icon: Home, label: 'Home', index: 0 },
    { icon: PieIcon, label: 'Stats', index: 1 },
    { icon: Plus, label: 'Add', index: 2, isAction: true },
    { icon: Wallet, label: 'Wallets', index: 3 },
    { icon: Brain, label: 'AI', index: 5 },
    { icon: User, label: 'Profile', index: 4 },
  ]

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isAction) {
      setShowAdd(true)
    } else {
      setTab(item.index)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border">
      <div className="mx-auto max-w-md grid grid-cols-6 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = tab === item.index
          
          return (
            <button
              key={item.index}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center gap-1 py-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label={item.label}
            >
              <div
                className={`p-2 rounded-2xl ${
                  item.isAction
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                    ? 'bg-primary/10'
                    : 'hover:bg-muted'
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="text-[11px]">{item.label}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
