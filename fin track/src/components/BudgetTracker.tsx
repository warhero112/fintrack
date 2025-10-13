import React, { useState } from 'react'
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { useAppStore, Budget } from '../stores/appStore'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import { Progress } from './ui/progress'
import { toast } from 'sonner'

export const BudgetTracker: React.FC = () => {
  const { 
    budgets, 
    addBudget, 
    updateBudget, 
    deleteBudget, 
    categories,
    getFilteredTransactions 
  } = useAppStore()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: '',
    monthlyLimit: '',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    year: new Date().getFullYear()
  })

  const transactions = getFilteredTransactions()
  const currentMonth = new Date().toISOString().slice(0, 7)

  // Calculate current spending for each budget
  const budgetsWithSpending = budgets.map(budget => {
    const currentSpent = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.category &&
        new Date(t.date).toISOString().slice(0, 7) === budget.month &&
        new Date(t.date).getFullYear() === budget.year
      )
      .reduce((sum, t) => sum + t.amount, 0)

    const percentage = budget.monthlyLimit > 0 ? (currentSpent / budget.monthlyLimit) * 100 : 0
    const isOverBudget = currentSpent > budget.monthlyLimit

    return {
      ...budget,
      currentSpent,
      percentage: Math.min(percentage, 100),
      isOverBudget
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.monthlyLimit) {
      toast.error('Please fill in all required fields')
      return
    }

    const budgetData = {
      category: formData.category,
      monthlyLimit: parseFloat(formData.monthlyLimit),
      month: formData.month,
      year: formData.year,
      currentSpent: 0
    }

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData)
      toast.success('Budget updated successfully!')
    } else {
      addBudget(budgetData)
      toast.success('Budget created successfully!')
    }

    setFormData({
      category: '',
      monthlyLimit: '',
      month: new Date().toISOString().slice(0, 7),
      year: new Date().getFullYear()
    })
    setEditingBudget(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      monthlyLimit: budget.monthlyLimit.toString(),
      month: budget.month,
      year: budget.year
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteBudget(id)
    setDeleteId(null)
    toast.success('Budget deleted successfully!')
  }

  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Budget Tracker</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBudget(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Add Budget'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
                <Input
                  id="monthlyLimit"
                  type="number"
                  step="0.01"
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full">
                {editingBudget ? 'Update Budget' : 'Create Budget'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {budgetsWithSpending.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No budgets set up yet</p>
          <p className="text-sm">Create your first budget to start tracking spending</p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgetsWithSpending.map((budget) => (
            <div
              key={budget.id}
              className={`p-4 border rounded-lg ${
                budget.isOverBudget 
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' 
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{budget.category}</h3>
                  {budget.isOverBudget && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(budget)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(budget.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    ${budget.currentSpent.toFixed(2)} of ${budget.monthlyLimit.toFixed(2)}
                  </span>
                  <span className={`font-medium ${
                    budget.isOverBudget ? 'text-red-600' : 'text-foreground'
                  }`}>
                    {budget.percentage.toFixed(1)}%
                  </span>
                </div>
                
                <Progress 
                  value={budget.percentage} 
                  className={`h-2 ${
                    budget.isOverBudget ? '[&>div]:bg-red-500' : ''
                  }`}
                />
                
                <div className="text-xs text-muted-foreground">
                  {budget.month} {budget.year}
                  {budget.isOverBudget && (
                    <span className="text-red-600 font-medium ml-2">
                      Over budget by ${(budget.currentSpent - budget.monthlyLimit).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
