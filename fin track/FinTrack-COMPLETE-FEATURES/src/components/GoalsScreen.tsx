import React, { useState } from 'react'
import { Plus, Target, Edit3, Trash2, Calendar, DollarSign, TrendingUp, CheckCircle } from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  category: 'savings' | 'debt' | 'investment' | 'purchase' | 'emergency' | 'other'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

const DEFAULT_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    description: 'Build 6 months of expenses',
    targetAmount: 10000,
    currentAmount: 2500,
    targetDate: '2024-12-31',
    category: 'emergency',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Vacation Fund',
    description: 'Trip to Europe',
    targetAmount: 5000,
    currentAmount: 1200,
    targetDate: '2024-08-15',
    category: 'savings',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const GOAL_CATEGORIES = [
  { value: 'savings', label: 'Savings', icon: '💰', color: 'bg-green-100 text-green-800' },
  { value: 'debt', label: 'Debt Payment', icon: '💳', color: 'bg-red-100 text-red-800' },
  { value: 'investment', label: 'Investment', icon: '📈', color: 'bg-blue-100 text-blue-800' },
  { value: 'purchase', label: 'Purchase', icon: '🛍️', color: 'bg-purple-100 text-purple-800' },
  { value: 'emergency', label: 'Emergency', icon: '🚨', color: 'bg-orange-100 text-orange-800' },
  { value: 'other', label: 'Other', icon: '🎯', color: 'bg-gray-100 text-gray-800' }
]

const PRIORITY_COLORS = {
  low: 'text-green-600 bg-green-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-red-600 bg-red-100'
}

export const GoalsScreen: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('fintrack.goals')
    return saved ? JSON.parse(saved) : DEFAULT_GOALS
  })
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
    category: 'savings',
    priority: 'medium'
  })

  // Save goals to localStorage
  React.useEffect(() => {
    localStorage.setItem('fintrack.goals', JSON.stringify(goals))
  }, [goals])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100))
  }

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) return

    const goal: Goal = {
      id: Math.random().toString(36).slice(2, 10),
      title: newGoal.title!,
      description: newGoal.description || '',
      targetAmount: newGoal.targetAmount!,
      currentAmount: newGoal.currentAmount || 0,
      targetDate: newGoal.targetDate!,
      category: newGoal.category || 'savings',
      priority: newGoal.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setGoals([goal, ...goals])
    setNewGoal({
      title: '',
      description: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
      category: 'savings',
      priority: 'medium'
    })
    setShowAddGoal(false)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setNewGoal(goal)
    setShowAddGoal(true)
  }

  const handleUpdateGoal = () => {
    if (!editingGoal || !newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) return

    const updatedGoal: Goal = {
      ...editingGoal,
      ...newGoal,
      updatedAt: new Date().toISOString()
    }

    setGoals(goals.map(g => g.id === editingGoal.id ? updatedGoal : g))
    setEditingGoal(null)
    setNewGoal({
      title: '',
      description: '',
      targetAmount: 0,
      currentAmount: 0,
      targetDate: '',
      category: 'savings',
      priority: 'medium'
    })
    setShowAddGoal(false)
  }

  const handleDeleteGoal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(g => g.id !== id))
    }
  }

  const handleAddProgress = (goalId: string, amount: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: goal.currentAmount + amount, updatedAt: new Date().toISOString() }
        : goal
    ))
  }

  const TopBar = ({ title }: { title: string }) => (
    <div className="sticky top-0 z-10 bg-background rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 bg-card px-4 py-3 mb-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <button
        onClick={() => setShowAddGoal(true)}
        className="p-2 rounded-xl hover:bg-muted bg-primary text-primary-foreground"
        aria-label="Add goal"
      >
        <Plus size={18} />
      </button>
    </div>
  )

  return (
    <div className="pb-28">
      <TopBar title="Financial Goals" />
      <div className="px-4 space-y-4 max-w-md mx-auto">
        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Goals Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Set your first financial goal to start tracking your progress
              </p>
              <button
                onClick={() => setShowAddGoal(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount)
              const daysLeft = getDaysUntilTarget(goal.targetDate)
              const category = GOAL_CATEGORIES.find(c => c.value === goal.category)
              
              return (
                <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {goal.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${category?.color}`}>
                          {category?.icon} {category?.label}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[goal.priority]}`}>
                          {goal.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-2 rounded-xl hover:bg-muted"
                        aria-label="Edit goal"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 rounded-xl hover:bg-muted text-red-600"
                        aria-label="Delete goal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>{formatCurrency(goal.currentAmount)}</span>
                      <span>{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{progress}% complete</span>
                      <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const amount = prompt('Enter amount to add:', '100')
                        if (amount && !isNaN(Number(amount))) {
                          handleAddProgress(goal.id, Number(amount))
                        }
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Plus size={14} />
                      Add Progress
                    </button>
                    {progress >= 100 && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">Completed!</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Add/Edit Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={newGoal.title || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 bg-input-background"
                    placeholder="e.g., Emergency Fund"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newGoal.description || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 bg-input-background"
                    placeholder="e.g., Build 6 months of expenses"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Target Amount *
                    </label>
                    <input
                      type="number"
                      value={newGoal.targetAmount || ''}
                      onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                      className="w-full border rounded-xl px-3 py-2 bg-input-background"
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Current Amount
                    </label>
                    <input
                      type="number"
                      value={newGoal.currentAmount || ''}
                      onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
                      className="w-full border rounded-xl px-3 py-2 bg-input-background"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    value={newGoal.targetDate || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 bg-input-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Category
                    </label>
                    <select
                      value={newGoal.category || 'savings'}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                      className="w-full border rounded-xl px-3 py-2 bg-input-background"
                    >
                      {GOAL_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Priority
                    </label>
                    <select
                      value={newGoal.priority || 'medium'}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                      className="w-full border rounded-xl px-3 py-2 bg-input-background"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
                  className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium"
                >
                  {editingGoal ? 'Update Goal' : 'Add Goal'}
                </button>
                <button
                  onClick={() => {
                    setShowAddGoal(false)
                    setEditingGoal(null)
                    setNewGoal({
                      title: '',
                      description: '',
                      targetAmount: 0,
                      currentAmount: 0,
                      targetDate: '',
                      category: 'savings',
                      priority: 'medium'
                    })
                  }}
                  className="flex-1 bg-muted text-foreground py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
