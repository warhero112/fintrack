import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { 
  RefreshCw, 
  Bell, 
  Settings, 
  Smartphone, 
  Monitor,
  Menu,
  Search
} from 'lucide-react'

interface TopBarProps {
  title: string
  viewMode?: 'mobile' | 'desktop'
  setViewMode?: (mode: 'mobile' | 'desktop') => void
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
    <div className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="hidden sm:flex text-slate-600 hover:text-slate-900"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}

          {/* View Mode Toggle */}
          {showViewToggle && viewMode && setViewMode && (
            <div className="flex items-center border border-slate-200 rounded-lg p-1">
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className={`h-8 px-3 ${viewMode === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className={`h-8 px-3 ${viewMode === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative text-slate-600 hover:text-slate-900">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-slate-800 text-white">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}