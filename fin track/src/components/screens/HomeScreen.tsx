import { Plus, Calendar, Target, Sparkles, TrendingUp, Wallet, PieChart } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { BalanceCards } from '../BalanceCards';
import { RecentTransactions } from '../RecentTransactions';
import { BudgetOverview } from '../BudgetOverview';

export function HomeScreen() {
  const { setShowAdd, setTab, getTotals, transactions, budgets, getMonthlyTotals, getCategoryTotals } = useAppStore();
  
  const totals = getTotals();
  const currentDate = new Date();
  const monthlyTotals = getMonthlyTotals(currentDate.getFullYear(), currentDate.getMonth());
  const categoryTotals = getCategoryTotals();

  const quickActions = [
    { icon: Plus, label: 'Add Transaction', onClick: () => setShowAdd(true) },
    { icon: Calendar, label: 'Calendar', onClick: () => setTab(2) },
    { icon: Target, label: 'Goals', onClick: () => setTab(6) },
    { icon: Sparkles, label: 'AI Insights', onClick: () => setTab(5) }
  ];

  const stats = [
    { label: 'Monthly Income', value: `$${monthlyTotals.income.toLocaleString()}`, color: 'text-emerald-700' },
    { label: 'Monthly Expenses', value: `$${monthlyTotals.expenses.toLocaleString()}`, color: 'text-rose-700' },
    { label: 'Transactions', value: transactions.length.toString(), color: 'text-slate-700' }
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-slate-800 p-8 text-white shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-slate-300 mb-2 font-medium">Welcome back!</p>
            <h1 className="text-white mb-2 text-3xl font-bold">Your Financial Overview</h1>
            <p className="text-slate-300">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="w-20 h-20 rounded-3xl bg-slate-700 flex items-center justify-center shadow-lg">
            <Wallet className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-slate-300 text-lg font-medium">Net Worth:</span>
          <h1 className="text-white text-4xl font-bold">${totals.balance.toLocaleString()}</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-2xl bg-white p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-slate-600 text-xs mb-1 font-medium">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <BalanceCards
        balance={totals.balance}
        income={totals.income}
        expenses={totals.expenses}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="rounded-2xl bg-white p-6 border border-slate-200 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-slate-900 text-sm font-medium">{action.label}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <h3>Category Spending</h3>
          </div>
          
          <div className="space-y-3">
            {categoryTotals.slice(0, 5).map((cat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-900">{cat.category}</span>
                  <span className="text-slate-600">${cat.amount.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-700"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            {categoryTotals.length === 0 && (
              <p className="text-slate-500 text-center py-8">No spending data yet</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3>This Month</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div>
                <p className="text-emerald-700 text-sm">Income</p>
                <p className="text-emerald-900">${monthlyTotals.income.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div>
                <p className="text-rose-700 text-sm">Expenses</p>
                <p className="text-rose-900">${monthlyTotals.expenses.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white rotate-180" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 border border-slate-200">
              <div>
                <p className="text-slate-700 text-sm">Net</p>
                <p className="text-slate-900">${monthlyTotals.balance.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecentTransactions transactions={transactions} limit={5} />

      <BudgetOverview budgets={budgets} />
    </div>
  );
}