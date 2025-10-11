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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-transparent" />
      <div className="relative p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Recent Transactions</h3>
            <p className="text-gray-400 text-sm">Your latest financial activity</p>
          </div>
          <button 
            className="group relative overflow-hidden rounded-2xl px-6 py-3 font-medium transition-all duration-300 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25 active:scale-95"
            onClick={() => setShowAdd(true)}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
        
        <div className="space-y-4">
          {recentTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                <Plus className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400 mb-2 text-lg">No transactions yet</p>
              <p className="text-sm text-gray-500">Add your first transaction to get started</p>
            </div>
          )}
          
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
              <div className="p-6 flex items-center gap-6">
                {/* Icon */}
                <div className={`relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center border ${
                  transaction.type === 'income' 
                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                    : 'bg-rose-500/10 border-rose-500/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-6 h-6 text-rose-400" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-lg mb-1 truncate">
                    {transaction.description}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                      {transaction.category}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span>{transaction.date}</span>
                  </div>
                </div>
                
                {/* Amount */}
                <div className={`text-right font-bold text-xl ${
                  transaction.type === 'income' 
                    ? 'text-emerald-400' 
                    : 'text-rose-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount, settings?.currency || 'USD')}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="p-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
                    onClick={() => handleEdit(transaction)}
                    aria-label="Edit transaction"
                  >
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button 
                    className="p-3 rounded-xl hover:bg-rose-500/10 transition-colors border border-rose-500/20"
                    onClick={() => handleDelete(transaction.id)}
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
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
