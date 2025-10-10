import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/test-utils'
import { ViewModeToggle } from '../ViewModeToggle'

describe('ViewModeToggle', () => {
  const mockSetViewMode = vi.fn()

  beforeEach(() => {
    mockSetViewMode.mockClear()
  })

  it('renders all three view mode buttons', () => {
    render(
      <ViewModeToggle 
        viewMode="auto" 
        setViewMode={mockSetViewMode} 
      />
    )

    expect(screen.getByTitle('Mobile View')).toBeInTheDocument()
    expect(screen.getByTitle('Desktop View')).toBeInTheDocument()
    expect(screen.getByTitle('Auto (Responsive)')).toBeInTheDocument()
  })

  it('highlights the active view mode', () => {
    render(
      <ViewModeToggle 
        viewMode="mobile" 
        setViewMode={mockSetViewMode} 
      />
    )

    const mobileButton = screen.getByTitle('Mobile View')
    expect(mobileButton).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('calls setViewMode when buttons are clicked', () => {
    render(
      <ViewModeToggle 
        viewMode="auto" 
        setViewMode={mockSetViewMode} 
      />
    )

    fireEvent.click(screen.getByTitle('Mobile View'))
    expect(mockSetViewMode).toHaveBeenCalledWith('mobile')

    fireEvent.click(screen.getByTitle('Desktop View'))
    expect(mockSetViewMode).toHaveBeenCalledWith('desktop')

    fireEvent.click(screen.getByTitle('Auto (Responsive)'))
    expect(mockSetViewMode).toHaveBeenCalledWith('auto')
  })
})
