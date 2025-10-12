import { Target, Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useState } from 'react';

export function GoalsScreen() {
  const { goals, addGoal, updateGoal, deleteGoal } = useAppStore();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Savings',
    color: 'blue'
  });

  const colors = [
    { name: 'blue', bg: 'bg-blue-500' },
    { name: 'purple', bg: 'bg-purple-500' },
    { name: 'emerald', bg: 'bg-emerald-500' },
    { name: 'orange', bg: 'bg-orange-500' },
    { name: 'pink', bg: 'bg-pink-500' }
  ];

  const categories = ['Savings', 'Travel', 'Electronics', 'Education', 'Health', 'Investment', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }

    const goalData = {
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      category: formData.category,
      color: formData.color
    };

    if (editingGoal) {
      updateGoal(editingGoal, goalData);
      setEditingGoal(null);
    } else {
      addGoal(goalData);
    }

    setShowAddGoal(false);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: 'Savings',
      color: 'blue'
    });
  };

  const handleEdit = (goal: any) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      category: goal.category,
      color: goal.color
    });
    setEditingGoal(goal.id);
    setShowAddGoal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: any = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      emerald: 'bg-emerald-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500'
    };
    return colorMap[color] || 'bg-blue-500';
  };

  const getColorBgClass = (color: string) => {
    const colorMap: any = {
      blue: 'bg-blue-50',
      purple: 'bg-purple-50',
      emerald: 'bg-emerald-50',
      orange: 'bg-orange-50',
      pink: 'bg-pink-50'
    };
    return colorMap[color] || 'bg-blue-50';
  };

  const getColorTextClass = (color: string) => {
    const colorMap: any = {
      blue: 'text-blue-700',
      purple: 'text-purple-700',
      emerald: 'text-emerald-700',
      orange: 'text-orange-700',
      pink: 'text-pink-700'
    };
    return colorMap[color] || 'text-blue-700';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-800 p-8 text-white border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white">Financial Goals</h2>
              <p className="text-slate-300 text-sm">Track your progress towards your dreams</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition-all text-white"
          >
            <Plus className="w-5 h-5 inline mr-1" />
            New Goal
          </button>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-slate-900 mb-2">No goals yet</h3>
          <p className="text-slate-600 mb-6">Start setting financial goals to achieve your dreams</p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;

            return (
              <div
                key={goal.id}
                className={`rounded-2xl ${getColorBgClass(goal.color)} p-6 border border-slate-200 hover:shadow-md transition-all group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-10 h-10 rounded-xl ${getColorClass(goal.color)} flex items-center justify-center`}>
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-slate-900">{goal.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-lg ${getColorClass(goal.color)} text-white`}>
                          {goal.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-slate-600 text-sm">Progress</span>
                    <span className={getColorTextClass(goal.color)}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getColorClass(goal.color)} transition-all duration-500`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate-600 text-xs mb-1">Current</p>
                    <p className="text-slate-900">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <TrendingUp className={`w-5 h-5 ${getColorTextClass(goal.color)}`} />
                  <div className="text-right">
                    <p className="text-slate-600 text-xs mb-1">Target</p>
                    <p className="text-slate-900">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl ${getColorBgClass(goal.color)} border border-slate-200 text-center`}>
                  <p className="text-slate-600 text-xs mb-1">Deadline</p>
                  <p className="text-slate-900 text-sm">{formatDate(goal.deadline)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-800 p-6 text-white">
              <h2>{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Target Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="10000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Current Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-2">Color</label>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.name })}
                      className={`w-10 h-10 rounded-xl ${color.bg} transition-all ${
                        formData.color === color.name ? 'ring-4 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGoal(false);
                    setEditingGoal(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all"
                >
                  {editingGoal ? 'Update' : 'Create'} Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}