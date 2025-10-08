import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, Camera, Brain } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'
import { useTransactions } from '../../hooks/useTransactions'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { transactionSchema, TransactionFormData } from '../../utils/validation/schemas'

interface AddTransactionModalProps {
  onClose: () => void
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {
  const { accounts, categories, settings, setShowBillScanner, setShowAICategorizer } = useAppStore()
  const { createTransaction } = useTransactions()
  const { handleError, handleSuccess } = useErrorHandler()
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      label: '',
      category: categories[0] || 'Food',
      type: 'expense',
      date: new Date().toISOString().slice(0, 10),
      accountId: accounts[0]?.id || '',
    }
  })

  const watchedValues = watch()

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true)
    
    try {
      const result = createTransaction(data)
      
      if (result.success) {
        handleSuccess('Transaction added successfully!')
        onClose()
      } else {
        handleError(result.error || 'Failed to add transaction')
      }
    } catch (error) {
      handleError(error, 'Failed to add transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAICategorization = () => {
    if (!watchedValues.label || !watchedValues.amount) {
      handleError('Please enter description and amount first.')
      return
    }
    setShowAICategorizer(true)
  }

  const handleBillScan = () => {
    setShowBillScanner(true)
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <button
            className="p-2 rounded-xl hover:bg-muted"
            onClick={onClose}
            aria-label="Close"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-semibold text-foreground">Add Transaction</h3>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleBillScan}
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              title="Scan Bill/Receipt"
              aria-label="Scan receipt"
            >
              <Camera size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded-xl px-3 py-2 bg-input-background"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Type *
              </label>
              <select
                className="w-full border rounded-xl px-3 py-2 bg-input-background"
                {...register('type')}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Description *
            </label>
            <input
              type="text"
              className="w-full border rounded-xl px-3 py-2 bg-input-background"
              placeholder="e.g., Groceries"
              {...register('label')}
            />
            {errors.label && (
              <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Category *
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 border rounded-xl px-3 py-2 bg-input-background"
                  {...register('category')}
                >
                  {watchedValues.type === 'income' 
                    ? (settings.incomeCategories || categories).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))
                    : (settings.expenseCategories || categories).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))
                  }
                </select>
                <button
                  type="button"
                  onClick={handleAICategorization}
                  className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  title="AI Category Suggestion"
                  aria-label="AI categorization"
                >
                  <Brain size={16} />
                </button>
              </div>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Date *
              </label>
              <input
                type="date"
                className="w-full border rounded-xl px-3 py-2 bg-input-background"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Account *
            </label>
            <select
              className="w-full border rounded-xl px-3 py-2 bg-input-background"
              {...register('accountId')}
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {errors.accountId && (
              <p className="text-red-500 text-xs mt-1">{errors.accountId.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-muted text-foreground py-2 px-4 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
