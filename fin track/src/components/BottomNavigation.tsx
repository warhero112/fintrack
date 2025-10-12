import { Home, TrendingUp, Calendar, List, Settings as SettingsIcon, Bot, Target } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const navItems = [
  { id: 0, icon: Home, label: 'Home', color: 'slate-700' },
  { id: 1, icon: TrendingUp, label: 'Insights', color: 'slate-700' },
  { id: 2, icon: Calendar, label: 'Calendar', color: 'slate-700' },
  { id: 3, icon: List, label: 'Transactions', color: 'slate-700' },
  { id: 4, icon: SettingsIcon, label: 'Settings', color: 'slate-700' },
  { id: 5, icon: Bot, label: 'AI Advisor', color: 'slate-700' },
  { id: 6, icon: Target, label: 'Goals', color: 'slate-700' }
];

export function BottomNavigation() {
  const { tab, setTab } = useAppStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-bottom">
      <div className="max-w-md mx-auto px-1 py-1.5">
        <div className="flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;
            return (
              <button key={item.id} onClick={() => setTab(item.id)} className="flex flex-col items-center gap-0.5 px-1 py-1.5 min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-slate-800' : 'bg-transparent'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                </div>
                <span className={`text-[10px] leading-tight truncate max-w-full transition-all ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}