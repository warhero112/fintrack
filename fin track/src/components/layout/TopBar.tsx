import React from 'react'
import { RefreshCw, Settings, Bell, Monitor, Smartphone } from 'lucide-react'

interface TopBarProps {
  title: string
  viewMode?: string
  setViewMode?: (mode: string) => void
  showViewToggle?: boolean
  onRefresh?: () => void
}

export const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  viewMode, 
  setViewMode, 
  showViewToggle = false,
  onRefresh 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* View Mode Toggle */}
          {showViewToggle && viewMode && setViewMode && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'mobile' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mobile
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'desktop' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Desktop
              </button>
            </div>
          )}

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          {/* Settings Button */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
