import { Sparkles, RefreshCw, Settings, Monitor, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';

interface TopBarProps {
  onRefresh?: () => void;
}

export function TopBar({ onRefresh }: TopBarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { viewMode, setViewMode } = useAppStore();

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'mobile' ? 'desktop' : 'mobile');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-lg">FinTrack</h1>
              <p className="text-gray-500 text-xs">Personal Finance Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh} 
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={toggleViewMode} 
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              {viewMode === 'mobile' ? <Smartphone className="w-5 h-5 text-gray-600" /> : <Monitor className="w-5 h-5 text-gray-600" />}
            </button>
            <button className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:scale-105">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}