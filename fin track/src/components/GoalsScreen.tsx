import React, { useState } from 'react'
import { Plus, Plane, Car, Shield, Target, Edit, Trash2 } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Progress } from './ui/progress'

export const GoalsScreen: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, addToGoal } = useAppStore()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'savings',
    priority: 'medium'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const goal = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      targetDate: formData.targetDate,
      category: formData.category,
      priority: formData.priority,
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingGoal) {
      updateGoal(goal)
    } else {
      addGoal(goal)
    }

    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: 'savings',
      priority: 'medium'
    })
    setShowAddGoal(false)
    setEditingGoal(null)
  }

  const handleEdit = (goal: any) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate,
      category: goal.category,
      priority: goal.priority
    })
    setShowAddGoal(true)
  }

  const handleAddToGoal = (goalId: string, amount: number) => {
    addToGoal(goalId, amount)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Plane className="w-6 h-6" />
      case 'vehicle': return <Car className="w-6 h-6" />
      case 'emergency': return <Shield className="w-6 h-6" />
      default: return <Target className="w-6 h-6" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Goals</h1>
          <p className="text-muted-foreground">Track your progress towards financial milestones</p>
        </div>
        <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingGoal(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Save $5,000 for emergencies"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="5000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentAmount">Current Amount</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGoal ? 'Update Goal' : 'Add Goal'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4">Create your first financial goal to get started</p>
            <Button onClick={() => setShowAddGoal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Goal
            </Button>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount)
            const remaining = goal.targetAmount - goal.currentAmount
            const isCompleted = goal.currentAmount >= goal.targetAmount

            return (
              <div key={goal.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                          {goal.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {progress.toFixed(1)}% complete
                    </span>
                    <span className={isCompleted ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                      {isCompleted ? 'Completed!' : `${formatCurrency(remaining)} remaining`}
                    </span>
                  </div>
                </div>

                {!isCompleted && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Amount to add"
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement
                            const amount = parseFloat(input.value)
                            if (amount > 0) {
                              handleAddToGoal(goal.id, amount)
                              input.value = ''
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={(e) => {
                          const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement
                          const amount = parseFloat(input.value)
                          if (amount > 0) {
                            handleAddToGoal(goal.id, amount)
                            input.value = ''
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
