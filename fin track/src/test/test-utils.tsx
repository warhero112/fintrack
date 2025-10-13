import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Toaster } from 'sonner'

// Mock the app store
const mockAppStore = {
  transactions: [],
  goals: [],
  budgets: [],
  categories: [],
  settings: {
    theme: 'light',
    currency: 'USD',
    language: 'en',
  },
  tab: 0,
  showAdd: false,
  showAICategorizer: false,
  showBillScanner: false,
  setTab: vi.fn(),
  setShowAdd: vi.fn(),
  setShowAICategorizer: vi.fn(),
  setShowBillScanner: vi.fn(),
  addTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  addGoal: vi.fn(),
  updateGoal: vi.fn(),
  deleteGoal: vi.fn(),
  addToGoal: vi.fn(),
  addBudget: vi.fn(),
  updateBudget: vi.fn(),
  deleteBudget: vi.fn(),
  addCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  updateSettings: vi.fn(),
  getFilteredTransactions: vi.fn(() => []),
  processRecurringTransactions: vi.fn(),
  exportToCSV: vi.fn(() => ''),
  exportToJSON: vi.fn(() => ''),
  importFromCSV: vi.fn(),
  importFromJSON: vi.fn(),
}

// Mock the useAppStore hook
vi.mock('../stores/appStore', () => ({
  useAppStore: () => mockAppStore,
}))

// Mock the view mode hook
vi.mock('../hooks/useViewMode', () => ({
  useViewMode: () => ({
    viewMode: 'auto',
    setViewMode: vi.fn(),
    isMobileView: false,
    setIsMobileView: vi.fn(),
  }),
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Home: () => <div data-testid="home-icon">Home</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  Wallet: () => <div data-testid="wallet-icon">Wallet</div>,
  BarChart3: () => <div data-testid="chart-icon">Chart</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  Brain: () => <div data-testid="brain-icon">Brain</div>,
  Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  Smartphone: () => <div data-testid="smartphone-icon">Smartphone</div>,
  Laptop: () => <div data-testid="laptop-icon">Laptop</div>,
  Monitor: () => <div data-testid="monitor-icon">Monitor</div>,
}))

// Mock Recharts components
vi.mock('recharts', () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
  Cell: ({ children }: { children: React.ReactNode }) => <div data-testid="cell">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ children }: { children: React.ReactNode }) => <div data-testid="line">{children}</div>,
  XAxis: ({ children }: { children: React.ReactNode }) => <div data-testid="x-axis">{children}</div>,
  YAxis: ({ children }: { children: React.ReactNode }) => <div data-testid="y-axis">{children}</div>,
  CartesianGrid: ({ children }: { children: React.ReactNode }) => <div data-testid="cartesian-grid">{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip">{children}</div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
}))

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
export { mockAppStore }
