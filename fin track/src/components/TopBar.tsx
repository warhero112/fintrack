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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900">FinTrack</h1>
              <p className="text-slate-600 text-xs">Personal Finance Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all">
              <RefreshCw className={`w-5 h-5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={toggleViewMode} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all">
              {viewMode === 'mobile' ? <Smartphone className="w-5 h-5 text-slate-600" /> : <Monitor className="w-5 h-5 text-slate-600" />}
            </button>
            <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}