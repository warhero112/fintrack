import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, Camera, Brain } from 'lucide-react'
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
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense')

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

  const currentCategories = transactionType === 'income' 
    ? (settings.incomeCategories || categories)
    : (settings.expenseCategories || categories)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card shadow-sm">
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
          <h1 className="text-[24px] font-bold leading-tight tracking-[-0.015em] text-center text-foreground">Add Transaction</h1>
          <div></div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 pb-4">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-foreground text-base font-medium leading-normal pb-2">Amount</p>
                <input
                  type="number"
                  step="0.01"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted focus:border-none h-14 placeholder:text-muted-foreground p-4 text-base font-normal leading-normal"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                )}
              </label>
            </div>

            {/* Description */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 pb-4">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-foreground text-base font-medium leading-normal pb-2">Description</p>
                <input
                  type="text"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted focus:border-none h-14 placeholder:text-muted-foreground p-4 text-base font-normal leading-normal"
                  placeholder="e.g., Groceries"
                  {...register('label')}
                />
                {errors.label && (
                  <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>
                )}
              </label>
            </div>

            {/* Category */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 pb-4">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-foreground text-base font-medium leading-normal pb-2">Category</p>
                <select
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted focus:border-none h-14 placeholder:text-muted-foreground p-4 text-base font-normal leading-normal"
                  {...register('category')}
                >
                  {currentCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                )}
              </label>
            </div>

            {/* Date */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 pb-4">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-foreground text-base font-medium leading-normal pb-2">Date</p>
                <input
                  type="date"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted focus:border-none h-14 placeholder:text-muted-foreground p-4 text-base font-normal leading-normal"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                )}
              </label>
            </div>

            {/* Transaction Type Toggle */}
            <div className="flex justify-center py-4">
              <div className="flex h-10 w-48 items-center justify-center rounded-xl bg-muted p-1">
                <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl px-2 ${transactionType === 'expense' ? 'bg-background shadow-[0_0_4px_rgba(0,0,0,0.1)] text-foreground' : 'text-muted-foreground'} text-sm font-medium leading-normal`}>
                  <span className="truncate">Expense</span>
                  <input 
                    type="radio" 
                    name="transactionType" 
                    className="invisible w-0" 
                    value="expense" 
                    checked={transactionType === 'expense'}
                    onChange={() => {
                      setTransactionType('expense')
                      setValue('type', 'expense')
                    }}
                  />
                </label>
                <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl px-2 ${transactionType === 'income' ? 'bg-background shadow-[0_0_4px_rgba(0,0,0,0.1)] text-foreground' : 'text-muted-foreground'} text-sm font-medium leading-normal`}>
                  <span className="truncate">Income</span>
                  <input 
                    type="radio" 
                    name="transactionType" 
                    className="invisible w-0" 
                    value="income"
                    checked={transactionType === 'income'}
                    onChange={() => {
                      setTransactionType('income')
                      setValue('type', 'income')
                    }}
                  />
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Action */}
        <div className="sticky bottom-0 flex justify-center p-4 bg-card/90 backdrop-blur-sm">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-14 px-4 flex-1 bg-primary text-primary-foreground text-lg font-bold leading-normal tracking-[0.015em] shadow-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <span className="truncate">{isSubmitting ? 'Saving...' : 'Save Transaction'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
