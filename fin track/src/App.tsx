import React, { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { useAppStore } from './stores/appStore'
import { useViewMode } from './hooks/useViewMode'
import { useLoading } from './hooks/useLoading'
import { ErrorBoundary } from './components/ErrorBoundary'

// Layout Components
import { TopBar } from './components/layout/TopBar'
import { BottomNavigation } from './components/layout/BottomNavigation'
import { DesktopNav } from './components/layout/DesktopNav'

// Screen Components
import { HomeScreen } from './screens/HomeScreen'
import { EnhancedInsightsScreen } from './screens/EnhancedInsightsScreen'
import { CalendarScreen } from './screens/CalendarScreen'
import { WalletsScreen } from './screens/WalletsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { AIAdvisorScreen } from './screens/AIAdvisorScreen'
import { GoalsScreen } from './screens/GoalsScreen'

// Modal Components
import { AddTransactionModal } from './components/modals/AddTransactionModal'
import { Sidebar } from './components/Sidebar'

// PWA Components
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt'
import { UpdatePrompt } from './components/pwa/UpdatePrompt'
import { OfflineIndicator } from './components/pwa/OfflineIndicator'

// Loading Components
import { LoadingScreen } from './components/ui/loading-screen'
import { RefreshScenario } from './components/ui/refresh-scenario'

// Feature Components
import { FloatingActionButton } from './components/FloatingActionButton'
import { TransactionList } from './components/TransactionList'
import { SearchAndFilter } from './components/SearchAndFilter'
import { ExportImport } from './components/ExportImport'
import { CategoryChart } from './components/analytics/CategoryChart'
import { TrendsChart } from './components/analytics/TrendsChart'
import { BudgetTracker } from './components/BudgetTracker'
import { RecurringTransactions } from './components/RecurringTransactions'

// AI Components
import { AIFinancialAdvisor } from './components/ai/AIFinancialAdvisor'
import { SmartCategorizer } from './components/ai/SmartCategorizer'
import { BillScanner } from './components/scanning/BillScanner'

// Hooks
import { usePWA } from './hooks/usePWA'

function App() {
  const { 
    tab, 
    setTab, 
    showAdd, 
    setShowAdd, 
    showAICategorizer, 
    setShowAICategorizer,
    showBillScanner,
    setShowBillScanner,
    editingTransaction,
    setEditingTransaction,
    processRecurringTransactions
  } = useAppStore()

  const { viewMode, setViewMode, isMobileView } = useViewMode()
  const { isOnline } = usePWA()

  // Loading states
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [showRefresh, setShowRefresh] = useState(false)
  const loading = useLoading(isInitialLoad)

  // Process recurring transactions on mount
  useEffect(() => {
    processRecurringTransactions()
  }, [processRecurringTransactions])

  // Handle URL parameters for PWA shortcuts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const action = urlParams.get('action')
    const tabParam = urlParams.get('tab')

    if (action === 'add') {
      setShowAdd(true)
    }

    if (tabParam) {
      const tabIndex = parseInt(tabParam)
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 6) {
        setTab(tabIndex)
      }
    }
  }, [setShowAdd, setTab])

  // Handle initial loading
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        loading.completeLoading()
        setTimeout(() => {
          setIsInitialLoad(false)
        }, 1000)
      }, 2000) // Reduced to 2 seconds

      return () => clearTimeout(timer)
    }
  }, [isInitialLoad, loading])

  // Handle refresh scenario
  const handleRefresh = () => {
    setShowRefresh(true)
  }

  const handleRefreshComplete = () => {
    setShowRefresh(false)
    // Trigger data refresh here
    window.location.reload()
  }

  // Show loading screen during initial load
  if (isInitialLoad) {
    return (
      <LoadingScreen
        isVisible={loading.isVisible}
        progress={loading.progress}
        message={loading.message}
      />
    )
  }

  // Show refresh scenario
  if (showRefresh) {
    return (
      <RefreshScenario
        isVisible={showRefresh}
        onComplete={handleRefreshComplete}
      />
    )
  }

  const renderScreen = () => {
    const screenProps = { isMobileView }

    switch (tab) {
      case 0: // Home
        return <HomeScreen {...screenProps} />
      case 1: // Enhanced Insights
        return <EnhancedInsightsScreen {...screenProps} />
      case 2: // Calendar
        return <CalendarScreen {...screenProps} />
      case 3: // Transactions
        return (
          <div className="space-y-6">
            <SearchAndFilter />
            <ExportImport />
            <TransactionList />
          </div>
        )
      case 4: // Settings
        return (
          <div className="space-y-6">
            <BudgetTracker />
            <RecurringTransactions />
          </div>
        )
      case 5: // AI Advisor
        return <AIAdvisorScreen {...screenProps} />
      case 6: // Goals
        return <GoalsScreen {...screenProps} />
      default:
        return <HomeScreen {...screenProps} />
    }
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-black text-white ${isMobileView ? 'pb-24' : ''}`}>
        {/* Desktop Navigation */}
        <DesktopNav isMobileView={isMobileView} />

        {/* Main Content */}
        <div className={`${!isMobileView ? 'ml-64' : ''} transition-all duration-300`}>
          {/* Top Bar */}
          <TopBar
            title="FinTrack"
            viewMode={viewMode}
            setViewMode={setViewMode}
            showViewToggle={!isMobileView}
            onRefresh={handleRefresh}
          />

          {/* Screen Content */}
          <div className={`${isMobileView ? 'px-4 pb-28' : 'px-6 pb-8'}`}>
            {renderScreen()}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNavigation isMobileView={isMobileView} />

        {/* Floating Action Button */}
        <FloatingActionButton />

        {/* Modals - Only render when needed */}
        {showAdd && (
          <AddTransactionModal 
            onClose={() => {
              setShowAdd(false)
              setEditingTransaction(null)
            }}
            editingTransaction={editingTransaction}
          />
        )}

        {/* AI Components */}
        {showAICategorizer && (
          <SmartCategorizer onClose={() => setShowAICategorizer(false)} />
        )}

        {showBillScanner && (
          <BillScanner onClose={() => setShowBillScanner(false)} />
        )}

        {/* Sidebar */}
        <Sidebar />

        {/* PWA Components */}
        <PWAInstallPrompt />
        <UpdatePrompt />
        <OfflineIndicator />

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </ErrorBoundary>
  )
}

export default App
