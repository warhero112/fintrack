import React, { useState } from 'react'
import { Plus, Target, Edit3, Trash2, List, Plane, Car, Shield } from 'lucide-react'

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
    title: 'Vacation Fund',
    description: 'Save $10,000 by Dec 31, 2024',
    targetAmount: 10000,
    currentAmount: 6818,
    targetDate: '2024-12-31',
    category: 'savings',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'New Car',
    description: 'Save $5,000 by Jun 30, 2025',
    targetAmount: 5000,
    currentAmount: 1500,
    targetDate: '2025-06-30',
    category: 'purchase',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Emergency Fund',
    description: 'Save $2,000 by Dec 31, 2024',
    targetAmount: 2000,
    currentAmount: 1818,
    targetDate: '2024-12-31',
    category: 'emergency',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const GOAL_ICONS = {
  savings: Plane,
  debt: Car,
  investment: Target,
  purchase: Car,
  emergency: Shield,
  other: Target
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

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div>
        {/* Header */}
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <div className="text-[#111418] flex size-12 shrink-0 items-center">
            <List className="w-6 h-6" />
          </div>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Goals</h2>
        </div>

        {/* Goals List */}
        <div className="space-y-0">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount)
            const Icon = GOAL_ICONS[goal.category]
            
            return (
              <div key={goal.id}>
                <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">{goal.title}</p>
                      <p className="text-[#617589] text-sm font-normal leading-normal line-clamp-2">{goal.description}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-[88px] overflow-hidden rounded-sm bg-[#dbe0e6]">
                        <div className="h-1 rounded-full bg-[#111418]" style={{width: `${progress}%`}}></div>
                      </div>
                      <p className="text-[#111418] text-sm font-medium leading-normal">{progress}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-stretch">
                  <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
                    <button
                      onClick={() => {
                        const amount = prompt('Enter amount to add:', '100')
                        if (amount && !isNaN(Number(amount))) {
                          handleAddProgress(goal.id, Number(amount))
                        }
                      }}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="truncate">Fund</span>
                    </button>
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="truncate">Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        <div className="flex justify-end overflow-hidden px-5 pb-5">
          <button
            onClick={() => setShowAddGoal(true)}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-[#1380ec] text-white text-base font-bold leading-normal tracking-[0.015em] min-w-0 gap-4 pl-4 pr-6"
          >
            <Plus className="w-6 h-6" />
            <span className="truncate">Add Goal</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Goal Title *</label>
                <input
                  type="text"
                  value={newGoal.title || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                  placeholder="e.g., Emergency Fund"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  value={newGoal.description || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                  placeholder="e.g., Build 6 months of expenses"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Target Amount *</label>
                  <input
                    type="number"
                    value={newGoal.targetAmount || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                    className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Current Amount</label>
                  <input
                    type="number"
                    value={newGoal.currentAmount || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
                    className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Target Date *</label>
                <input
                  type="date"
                  value={newGoal.targetDate || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category</label>
                  <select
                    value={newGoal.category || 'savings'}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                    className="w-full border rounded-xl px-3 py-2 bg-gray-50"
                  >
                    <option value="savings">Savings</option>
                    <option value="debt">Debt Payment</option>
                    <option value="investment">Investment</option>
                    <option value="purchase">Purchase</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Priority</label>
                  <select
                    value={newGoal.priority || 'medium'}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                    className="w-full border rounded-xl px-3 py-2 bg-gray-50"
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
                className="flex-1 bg-[#1380ec] text-white py-2 px-4 rounded-lg font-medium"
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
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
