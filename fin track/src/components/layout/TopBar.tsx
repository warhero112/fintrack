import React from 'react'
import { Menu } from 'lucide-react'
import { ViewModeToggle } from '../ViewModeToggle'

interface TopBarProps {
  title: string
  onMenuClick?: () => void
  viewMode?: 'auto' | 'mobile' | 'desktop'
  setViewMode?: (mode: 'auto' | 'mobile' | 'desktop') => void
  showViewToggle?: boolean
}

export const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  onMenuClick,
  viewMode,
  setViewMode,
  showViewToggle = false
}) => {
  return (
    <div className="sticky top-0 z-10 bg-background rounded-2xl shadow-sm border border-border bg-card px-4 py-3 mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      
      {showViewToggle && viewMode && setViewMode && (
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      )}
    </div>
  )
}
