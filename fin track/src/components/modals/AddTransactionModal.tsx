import React, { useState, useEffect } from 'react'
import { X, Calendar, DollarSign, FileText, Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useAppStore, Transaction } from '../../stores/appStore'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  editingTransaction?: Transaction | null
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ 
  isOpen,
  onClose, 
  editingTransaction 
}) => {
  const { 
    addTransaction, 
    updateTransaction, 
    categories, 
    settings,
    editingTransaction: storeEditingTransaction
  } = useAppStore()
  
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (editingTransaction || storeEditingTransaction) {
      const transaction = editingTransaction || storeEditingTransaction
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description,
        category: transaction.category,
        date: transaction.date
      })
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      })
    }
  }, [editingTransaction, storeEditingTransaction])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const transactionData = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      category: formData.category,
      date: formData.date,
      id: editingTransaction?.id || Date.now().toString()
    }
    
    if (editingTransaction || storeEditingTransaction) {
      updateTransaction(transactionData)
    } else {
      addTransaction(transactionData)
    }
    
    onClose()
    setErrors({})
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const isEditing = !!(editingTransaction || storeEditingTransaction)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <FileText className="h-5 w-5" />
                Edit Transaction
              </>
            ) : (
              <>
                <DollarSign className="h-5 w-5" />
                Add Transaction
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update your transaction details' : 'Add a new income or expense'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Tabs 
              value={formData.type} 
              onValueChange={(value) => handleInputChange('type', value)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="expense" className="flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4" />
                  Expense
                </TabsTrigger>
                <TabsTrigger value="income" className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Income
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`pl-10 ${errors.amount ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`pl-10 ${errors.description ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className={`pl-10 ${errors.category ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`pl-10 ${errors.date ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Transaction' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}