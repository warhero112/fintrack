import React, { useState, useEffect } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Toaster } from 'sonner'
import { useAppStore } from './stores/appStore'
import { HomeScreen } from './screens/HomeScreen'
import { StatsScreen } from './screens/StatsScreen'
import { WalletsScreen } from './screens/WalletsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { AIAdvisorScreen } from './screens/AIAdvisorScreen'
import { GoalsScreen } from './screens/GoalsScreen'
import { CalendarScreen } from './screens/CalendarScreen'
import { BottomNavigation } from './components/layout/BottomNavigation'
import { AddTransactionModal } from './components/modals/AddTransactionModal'
import { SmartCategorizer } from './components/ai/SmartCategorizer'
import { BillScanner } from './components/scanning/BillScanner'
import { Sidebar } from './components/Sidebar'
import { FloatingActionButton } from './components/FloatingActionButton'
import { TransactionList } from './components/TransactionList'
import { SearchAndFilter } from './components/SearchAndFilter'
import { ExportImport } from './components/ExportImport'
import { CategoryChart } from './components/analytics/CategoryChart'
import { TrendsChart } from './components/analytics/TrendsChart'
import { BudgetTracker } from './components/BudgetTracker'
import { RecurringTransactions } from './components/RecurringTransactions'

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
    setSettings,
    getFilteredTransactions,
    processRecurringTransactions,
  } = useAppStore()

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  // Process recurring transactions on app start
  useEffect(() => {
    processRecurringTransactions()
  }, [processRecurringTransactions])

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
    const transactions = getFilteredTransactions()
    
    switch (tab) {
      case 0:
        return <HomeScreen />
      case 1:
        return (
          <div className="pb-28">
            <div className="sticky top-0 z-10 bg-background rounded-2xl shadow-sm border border-border bg-card px-4 py-3 mb-3">
              <h1 className="text-lg font-semibold text-foreground text-center">Insights</h1>
            </div>
            <div className="px-4 space-y-6">
              <SearchAndFilter />
              <TrendsChart />
              <CategoryChart />
            </div>
          </div>
        )
      case 2:
        return <CalendarScreen />
      case 3:
        return (
          <div className="pb-28">
            <div className="sticky top-0 z-10 bg-background rounded-2xl shadow-sm border border-border bg-card px-4 py-3 mb-3">
              <h1 className="text-lg font-semibold text-foreground text-center">Transactions</h1>
            </div>
            <div className="px-4 space-y-4">
              <div className="flex justify-between items-center">
                <SearchAndFilter />
                <ExportImport />
              </div>
              <TransactionList 
                transactions={transactions} 
                onEdit={setEditingTransaction}
              />
            </div>
          </div>
        )
      case 4:
        return (
          <div className="pb-28">
            <div className="sticky top-0 z-10 bg-background rounded-2xl shadow-sm border border-border bg-card px-4 py-3 mb-3">
              <h1 className="text-lg font-semibold text-foreground text-center">Settings</h1>
            </div>
            <div className="px-4 space-y-6">
              <BudgetTracker />
              <RecurringTransactions />
            </div>
          </div>
        )
      case 5:
        return <AIAdvisorScreen />
      case 6:
        return <GoalsScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        {renderScreen()}
        
        <BottomNavigation />
        <FloatingActionButton />
        
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          settings={settings}
          onSettingsChange={setSettings}
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        
        {showAdd && (
          <AddTransactionModal
            onClose={() => setShowAdd(false)}
            editingTransaction={editingTransaction}
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
