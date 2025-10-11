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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center">
              <div className="w-6 h-6 text-white">💰</div>
            </div>
            <div>
              <h1 className="text-slate-900">{title}</h1>
              <p className="text-slate-600 text-xs">Personal Finance Manager</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </button>
            
            {showViewToggle && viewMode && setViewMode && (
              <button
                onClick={() => setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
              >
                {viewMode === 'mobile' ? (
                  <Smartphone className="w-5 h-5 text-slate-600" />
                ) : (
                  <Monitor className="w-5 h-5 text-slate-600" />
                )}
              </button>
            )}

            <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>

            <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
