import { Settings as SettingsIcon, Bell, Download, Trash2, RefreshCw, Plus, Target } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/appStore';

export function SettingsScreen() {
  const { budgets, addBudget, deleteBudget, settings, transactions } = useAppStore();
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    category: '',
    limit: '',
    period: 'monthly' as 'monthly' | 'yearly'
  });

  const categories = ['Food', 'Utilities', 'Dining', 'Entertainment', 'Shopping', 'Transportation', 'Health', 'Education', 'Other'];

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetForm.category || !budgetForm.limit) {
      alert('Please fill in all fields');
      return;
    }

    addBudget({
      category: budgetForm.category,
      limit: parseFloat(budgetForm.limit),
      period: budgetForm.period
    });

    setBudgetForm({ category: '', limit: '', period: 'monthly' });
    setShowAddBudget(false);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleBackup = () => {
    const data = {
      transactions,
      budgets,
      settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-800 p-8 text-white border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white">Settings</h2>
            <p className="text-slate-300 text-sm">Manage your preferences and budgets</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-slate-900">Budget Management</h3>
          </div>
          <button
            onClick={() => setShowAddBudget(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm hover:bg-slate-700 transition-all"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Budget
          </button>
        </div>

        {budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const percentage = (budget.spent / budget.limit) * 100;
              const isOverBudget = percentage >= 100;

              return (
                <div key={budget.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-slate-900">{budget.category}</h4>
                      <p className="text-slate-600 text-sm capitalize">{budget.period}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <p className="text-slate-900">${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}</p>
                        <p className={`text-sm ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {percentage.toFixed(0)}% used
                        </p>
                      </div>
                      <button
                        onClick={() => deleteBudget(budget.id)}
                        className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                      } transition-all duration-500`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No budgets set yet. Add one to get started!</p>
        )}
      </div>

      <div className="rounded-2xl bg-white p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-slate-900">Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <h4 className="text-slate-900 mb-1">Currency</h4>
              <p className="text-slate-600 text-sm">Default currency for transactions</p>
            </div>
            <select
              value={settings.currency}
              onChange={(e) => {
                console.log('Currency changed to:', e.target.value);
              }}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <h4 className="text-slate-900 mb-1">Notifications</h4>
              <p className="text-slate-600 text-sm">Receive alerts and reminders</p>
            </div>
            <button 
              onClick={() => console.log('Toggle notifications')}
              className="w-12 h-6 rounded-full bg-emerald-600 relative transition-all"
            >
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
            <div>
              <h4 className="text-slate-900 mb-1">Budget Alerts</h4>
              <p className="text-slate-600 text-sm">Get notified when approaching limits</p>
            </div>
            <button 
              onClick={() => console.log('Toggle budget alerts')}
              className="w-12 h-6 rounded-full bg-emerald-600 relative transition-all"
            >
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-slate-900">Data Management</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleBackup}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-all text-left"
          >
            <Download className="w-6 h-6 text-slate-700 mb-2" />
            <h4 className="text-slate-900 mb-1">Backup Data</h4>
            <p className="text-slate-600 text-sm">Export all your data as JSON</p>
          </button>

          <button className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-all text-left">
            <RefreshCw className="w-6 h-6 text-slate-700 mb-2" />
            <h4 className="text-slate-900 mb-1">Restore Data</h4>
            <p className="text-slate-600 text-sm">Import from backup file</p>
          </button>

          <button
            onClick={handleClearData}
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:shadow-md transition-all text-left"
          >
            <Trash2 className="w-6 h-6 text-rose-600 mb-2" />
            <h4 className="text-rose-900 mb-1">Clear All Data</h4>
            <p className="text-rose-600 text-sm">Permanently delete everything</p>
          </button>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h4 className="text-emerald-900 mb-1">Storage Used</h4>
            <p className="text-emerald-700">{transactions.length} transactions</p>
            <p className="text-emerald-600 text-sm">{budgets.length} budgets configured</p>
          </div>
        </div>
      </div>

      {showAddBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-800 p-6 text-white">
              <h2>Add Budget</h2>
            </div>

            <form onSubmit={handleAddBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">Category</label>
                <select
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-2">Budget Limit</label>
                <input
                  type="number"
                  step="0.01"
                  value={budgetForm.limit}
                  onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })}
                  placeholder="1000"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-2">Period</label>
                <select
                  value={budgetForm.period}
                  onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBudget(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all"
                >
                  Add Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}