import { useCallback } from 'react'
import { useAppStore } from '../stores/appStore'
import { Transaction } from '../types'
import { transactionSchema } from '../utils/validation/schemas'

export const useTransactions = () => {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTotals,
    getTransactionsByCategory,
    getMonthlySeries,
  } = useAppStore()

  const validateTransaction = useCallback((data: Partial<Transaction>) => {
    try {
      return transactionSchema.parse(data)
    } catch (error) {
      throw new Error('Invalid transaction data')
    }
  }, [])

  const createTransaction = useCallback((data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      validateTransaction(data)
      addTransaction(data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }, [addTransaction, validateTransaction])

  const editTransaction = useCallback((id: string, data: Partial<Transaction>) => {
    try {
      if (Object.keys(data).length > 0) {
        validateTransaction(data as Transaction)
      }
      updateTransaction(id, data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }, [updateTransaction, validateTransaction])

  const removeTransaction = useCallback((id: string) => {
    deleteTransaction(id)
    return { success: true }
  }, [deleteTransaction])

  const totals = getTotals()
  const categoryData = getTransactionsByCategory()
  const monthlyData = getMonthlySeries()

  return {
    transactions,
    totals,
    categoryData,
    monthlyData,
    createTransaction,
    editTransaction,
    removeTransaction,
  }
}
