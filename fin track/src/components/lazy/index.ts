import { lazy } from 'react'

// Lazy load heavy components
export const LazyBillScanner = lazy(() => import('../scanning/BillScanner'))
export const LazyAIFinancialAdvisor = lazy(() => import('../ai/AIFinancialAdvisor'))
export const LazySmartCategorizer = lazy(() => import('../ai/SmartCategorizer'))
export const LazyCategoryChart = lazy(() => import('../analytics/CategoryChart'))
export const LazyTrendsChart = lazy(() => import('../analytics/TrendsChart'))
export const LazyBudgetTracker = lazy(() => import('../BudgetTracker'))
export const LazyRecurringTransactions = lazy(() => import('../RecurringTransactions'))
export const LazyTransactionList = lazy(() => import('../TransactionList'))
export const LazyExportImport = lazy(() => import('../ExportImport'))
export const LazySearchAndFilter = lazy(() => import('../SearchAndFilter'))

// Lazy load screens
export const LazyCalendarScreen = lazy(() => import('../../screens/CalendarScreen'))
export const LazyGoalsScreen = lazy(() => import('../../screens/GoalsScreen'))
export const LazyAIAdvisorScreen = lazy(() => import('../../screens/AIAdvisorScreen'))
