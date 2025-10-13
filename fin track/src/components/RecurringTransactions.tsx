import React, { useState } from 'react'
import { Plus, Edit, Trash2, Play, Pause, Calendar } from 'lucide-react'
import { useAppStore, RecurringTransaction } from '../stores/appStore'
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select'
import { toast } from 'sonner'

export const RecurringTransactions: React.FC = () => {
  const { 
    recurringTransactions, 
    addRecurringTransaction, 
    updateRecurringTransaction, 
    deleteRecurringTransaction,
    categories 
  } = useAppStore()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<RecurringTransaction | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    nextDate: new Date().toISOString().split('T')[0],
    isActive: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    const transactionData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      category: formData.category,
      frequency: formData.frequency,
      nextDate: formData.nextDate,
      isActive: formData.isActive
    }

    if (editingTransaction) {
      updateRecurringTransaction(editingTransaction.id, transactionData)
      toast.success('Recurring transaction updated successfully!')
    } else {
      addRecurringTransaction(transactionData)
      toast.success('Recurring transaction created successfully!')
    }

    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      category: '',
      frequency: 'monthly',
      nextDate: new Date().toISOString().split('T')[0],
      isActive: true
    })
    setEditingTransaction(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (transaction: RecurringTransaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
      frequency: transaction.frequency,
      nextDate: transaction.nextDate,
      isActive: transaction.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteRecurringTransaction(id)
    setDeleteId(null)
    toast.success('Recurring transaction deleted successfully!')
  }

  const toggleActive = (id: string, isActive: boolean) => {
    updateRecurringTransaction(id, { isActive: !isActive })
    toast.success(`Recurring transaction ${!isActive ? 'activated' : 'paused'}`)
  }

  const filteredCategories = categories.filter(cat => cat.type === formData.type)

  const formatNextDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly'
    }
    return labels[frequency as keyof typeof labels] || frequency
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Recurring Transactions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTransaction(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Recurring
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                    />
                    <span>Expense</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                    />
                    <span>Income</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this for?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextDate">Next Date</Label>
                <Input
                  id="nextDate"
                  type="date"
                  value={formData.nextDate}
                  onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingTransaction ? 'Update Recurring Transaction' : 'Create Recurring Transaction'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {recurringTransactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No recurring transactions set up yet</p>
          <p className="text-sm">Create recurring transactions for bills, salary, etc.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recurringTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`p-4 border rounded-lg ${
                transaction.isActive 
                  ? 'border-border bg-card' 
                  : 'border-muted bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{transaction.description}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    transaction.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {transaction.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(transaction.id, transaction.isActive)}
                  >
                    {transaction.isActive ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(transaction.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">{transaction.category}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {getFrequencyLabel(transaction.frequency)}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Next: {formatNextDate(transaction.nextDate)}
                  </span>
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
            <AlertDialogTitle>Delete Recurring Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recurring transaction? This action cannot be undone.
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
