import React from 'react'
import { Plus, Edit3, Trash2 } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${currency} ${amount}`
  }
}

export const RecentTransactions: React.FC = () => {
  const { 
    transactions, 
    settings, 
    setShowAdd, 
    deleteTransaction,
    setEditingTransaction 
  } = useAppStore()

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id)
    }
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setShowAdd(true)
  }

  // Safety check: ensure transactions is an array
  const safeTransactions = transactions || []
  
  // Get recent transactions (last 5)
  const recentTransactions = safeTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="rounded-2xl shadow-sm border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">Recent Transactions</div>
        <button 
          className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 font-medium shadow-sm hover:shadow transition active:scale-[.98] text-xs bg-muted text-foreground"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={16} /> New
        </button>
      </div>
      <div className="divide-y divide-border">
        {recentTransactions.length === 0 && (
          <div className="text-sm text-muted-foreground py-4 text-center">
            No transactions yet.
          </div>
        )}
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="py-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              transaction.type === 'income' 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              <span className={
                transaction.type === 'income' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }>
                {transaction.type === 'income' ? '+' : '-'}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">
                {transaction.description}
              </div>
              <div className="text-xs text-muted-foreground">
                {transaction.category} • {transaction.date}
              </div>
            </div>
            <div className={`text-sm font-semibold ${
              transaction.type === 'income' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount, settings?.currency || 'USD')}
            </div>
            <button 
              className="ml-2 p-2 rounded-xl hover:bg-muted"
              onClick={() => handleEdit(transaction)}
              aria-label="Edit transaction"
            >
              <Edit3 size={16} />
            </button>
            <button 
              className="p-2 rounded-xl hover:bg-muted"
              onClick={() => handleDelete(transaction.id)}
              aria-label="Delete transaction"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
