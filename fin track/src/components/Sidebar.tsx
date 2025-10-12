import { Home, TrendingUp, Calendar, List, Settings as SettingsIcon, Bot, Target } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const navItems = [
  { id: 0, icon: Home, label: 'Home' },
  { id: 1, icon: TrendingUp, label: 'Insights' },
  { id: 2, icon: Calendar, label: 'Calendar' },
  { id: 3, icon: List, label: 'Transactions' },
  { id: 4, icon: SettingsIcon, label: 'Settings' },
  { id: 5, icon: Bot, label: 'AI Advisor' },
  { id: 6, icon: Target, label: 'Goals' }
];

export function Sidebar() {
  const { tab, setTab } = useAppStore();

  return (
    <div className="fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.id;
          return (
            <button key={item.id} onClick={() => setTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}