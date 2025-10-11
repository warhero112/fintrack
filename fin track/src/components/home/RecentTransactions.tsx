import React from 'react'
import { Plus, Edit3, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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
    <div className="relative overflow-hidden rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-700/20" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Transactions</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your latest financial activity</p>
          </div>
          <button 
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 active:scale-95"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-2">No transactions yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-500">Add your first transaction to get started</p>
            </div>
          )}
          
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="group relative overflow-hidden rounded-xl bg-white/70 dark:bg-slate-700/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-200">
              <div className="p-4 flex items-center gap-4">
                {/* Icon */}
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  transaction.type === 'income' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                    : 'bg-rose-100 dark:bg-rose-900/30'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                      {transaction.category}
                    </span>
                    <span>•</span>
                    <span>{transaction.date}</span>
                  </div>
                </div>
                
                {/* Amount */}
                <div className={`text-right font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  <div className="text-lg">
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, settings?.currency || 'USD')}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button 
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    onClick={() => handleEdit(transaction)}
                    aria-label="Edit transaction"
                  >
                    <Edit3 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button 
                    className="p-2 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                    onClick={() => handleDelete(transaction.id)}
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
