import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/test-utils'
import { HomeScreen } from '../../screens/HomeScreen'

// Mock the components that HomeScreen uses
vi.mock('../home/BalanceCards', () => ({
  BalanceCards: () => <div data-testid="balance-cards">Balance Cards</div>
}))

vi.mock('../home/QuickActions', () => ({
  QuickActions: () => <div data-testid="quick-actions">Quick Actions</div>
}))

vi.mock('../home/MonthlyChart', () => ({
  MonthlyChart: () => <div data-testid="monthly-chart">Monthly Chart</div>
}))

vi.mock('../home/RecentTransactions', () => ({
  RecentTransactions: () => <div data-testid="recent-transactions">Recent Transactions</div>
}))

describe('HomeScreen', () => {
  it('renders without crashing', () => {
    render(<HomeScreen isMobileView={false} />)
    expect(screen.getByText('FinTrack')).toBeInTheDocument()
  })

  it('renders all main components', () => {
    render(<HomeScreen isMobileView={false} />)
    
    expect(screen.getByTestId('balance-cards')).toBeInTheDocument()
    expect(screen.getByTestId('quick-actions')).toBeInTheDocument()
    expect(screen.getByTestId('monthly-chart')).toBeInTheDocument()
    expect(screen.getByTestId('recent-transactions')).toBeInTheDocument()
  })

  it('applies mobile padding when isMobileView is true', () => {
    const { container } = render(<HomeScreen isMobileView={true} />)
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('pb-28')
  })

  it('applies desktop padding when isMobileView is false', () => {
    const { container } = render(<HomeScreen isMobileView={false} />)
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('pb-8')
  })
})
