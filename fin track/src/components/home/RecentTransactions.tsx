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

  const safeTransactions = transactions || []
  const recentTransactions = safeTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <p className="text-sm text-gray-500">Your latest financial activity</p>
        </div>
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
          onClick={() => setShowAdd(true)}
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>
      
      <div className="space-y-3">
        {recentTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No transactions yet</p>
            <p className="text-sm text-gray-400">Add your first transaction to get started</p>
          </div>
        )}
        
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              transaction.type === 'income' 
                ? 'bg-green-100' 
                : 'bg-red-100'
            }`}>
              {transaction.type === 'income' ? (
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {transaction.description}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {transaction.category}
                </span>
                <span>•</span>
                <span>{transaction.date}</span>
              </div>
            </div>
            
            {/* Amount */}
            <div className={`font-semibold text-lg ${
              transaction.type === 'income' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount, settings?.currency || 'USD')}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => handleEdit(transaction)}
                aria-label="Edit transaction"
              >
                <Edit3 className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                onClick={() => handleDelete(transaction.id)}
                aria-label="Delete transaction"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
