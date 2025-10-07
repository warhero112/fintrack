import React, { useEffect } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from 'sonner'
import { useAppStore } from './stores/appStore'
import { HomeScreen } from './screens/HomeScreen'
import { StatsScreen } from './screens/StatsScreen'
import { WalletsScreen } from './screens/WalletsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { AIAdvisorScreen } from './screens/AIAdvisorScreen'
import { BottomNavigation } from './components/layout/BottomNavigation'
import { AddTransactionModal } from './components/modals/AddTransactionModal'
import { SmartCategorizer } from './components/ai/SmartCategorizer'
import { BillScanner } from './components/scanning/BillScanner'

export default function App() {
  const {
    tab,
    showAdd,
    showAICategorizer,
    showBillScanner,
    setShowAdd,
    setShowAICategorizer,
    setShowBillScanner,
    settings,
  } = useAppStore()

  // Theme handling
  useEffect(() => {
    const applyTheme = () => {
      if (settings.theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.classList.toggle('dark', isDark)
      } else {
        document.documentElement.classList.toggle('dark', settings.theme === 'dark')
      }
    }
    
    applyTheme()
    
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', applyTheme)
      return () => mediaQuery.removeEventListener('change', applyTheme)
    }
  }, [settings.theme])

  const renderScreen = () => {
    switch (tab) {
      case 0:
        return <HomeScreen />
      case 1:
        return <StatsScreen />
      case 3:
        return <WalletsScreen />
      case 4:
        return <ProfileScreen />
      case 5:
        return <AIAdvisorScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-md pb-24">
          {renderScreen()}
        </div>
        
        <BottomNavigation />
        
        {showAdd && (
          <AddTransactionModal
            onClose={() => setShowAdd(false)}
          />
        )}
        
        {showAICategorizer && (
          <SmartCategorizer
            onClose={() => setShowAICategorizer(false)}
          />
        )}
        
        {showBillScanner && (
          <BillScanner
            onClose={() => setShowBillScanner(false)}
          />
        )}
        
        <Toaster
          position="top-center"
          expand={true}
          richColors={true}
          closeButton={true}
        />
      </div>
    </ErrorBoundary>
  )
}
