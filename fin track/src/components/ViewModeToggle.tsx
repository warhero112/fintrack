import React from 'react'
import { Monitor, Smartphone, Laptop } from 'lucide-react'

interface ViewModeToggleProps {
  viewMode: 'auto' | 'mobile' | 'desktop'
  setViewMode: (mode: 'auto' | 'mobile' | 'desktop') => void
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ 
  viewMode, 
  setViewMode 
}) => {
  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
      {/* Mobile View Button */}
      <button
        onClick={() => setViewMode('mobile')}
        className={`p-1.5 rounded-lg transition ${
          viewMode === 'mobile' 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-muted'
        }`}
        title="Mobile View"
      >
        <Smartphone size={14} />
      </button>
      
      {/* Desktop View Button */}
      <button
        onClick={() => setViewMode('desktop')}
        className={`p-1.5 rounded-lg transition ${
          viewMode === 'desktop' 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-muted'
        }`}
        title="Desktop View"
      >
        <Laptop size={14} />
      </button>
      
      {/* Auto/Responsive Button */}
      <button
        onClick={() => setViewMode('auto')}
        className={`p-1.5 rounded-lg transition ${
          viewMode === 'auto' 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-muted'
        }`}
        title="Auto (Responsive)"
      >
        <Monitor size={14} />
      </button>
    </div>
  )
}
