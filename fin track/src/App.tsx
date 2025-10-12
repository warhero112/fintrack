import { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import { TopBar } from './components/TopBar';
import { BottomNavigation } from './components/BottomNavigation';
import { Sidebar } from './components/Sidebar';
import { HomeScreen } from './components/screens/HomeScreen';
import { AIAdvisorScreen } from './components/screens/AIAdvisorScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { InsightsScreen } from './components/screens/InsightsScreen';
import { GoalsScreen } from './components/screens/GoalsScreen';
import { TransactionsScreen } from './components/screens/TransactionsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { TransactionModal } from './components/TransactionModal';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { tab, isLoading, setIsLoading, viewMode } = useAppStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  const renderScreen = () => {
    switch (tab) {
      case 0: return <HomeScreen />;
      case 1: return <InsightsScreen />;
      case 2: return <CalendarScreen />;
      case 3: return <TransactionsScreen />;
      case 4: return <SettingsScreen />;
      case 5: return <AIAdvisorScreen />;
      case 6: return <GoalsScreen />;
      default: return <HomeScreen />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-slate-900 mb-2">FinTrack</h2>
          <p className="text-slate-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'mobile') {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopBar onRefresh={() => window.location.reload()} />
        <main className="max-w-md mx-auto px-4 pt-24 pb-32">
          <div className={`transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {renderScreen()}
          </div>
        </main>
        <BottomNavigation />
        <TransactionModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar onRefresh={() => window.location.reload()} />
      <Sidebar />
      <main className="ml-64 pt-20 px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {renderScreen()}
          </div>
        </div>
      </main>
      <TransactionModal />
    </div>
  );
}