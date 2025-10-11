import React from 'react'
import { RefreshCw, Settings, Sparkles, Zap } from 'lucide-react'

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
    <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="group p-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-slate-600 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          )}

          {/* View Mode Toggle */}
          {showViewToggle && viewMode && setViewMode && (
            <div className="flex items-center bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  viewMode === 'mobile' 
                    ? 'bg-white text-slate-900 shadow-md scale-105' 
                    : 'text-slate-600 hover:text-slate-900 hover:scale-105'
                }`}
              >
                📱 Mobile
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  viewMode === 'desktop' 
                    ? 'bg-white text-slate-900 shadow-md scale-105' 
                    : 'text-slate-600 hover:text-slate-900 hover:scale-105'
                }`}
              >
                💻 Desktop
              </button>
            </div>
          )}

          {/* Settings Button */}
          <button className="group p-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
            <Settings className="w-5 h-5 text-slate-600 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}
