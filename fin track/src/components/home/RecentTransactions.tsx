import React from 'react'
import { Plus, Edit3, Trash2, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'
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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Recent Transactions</h2>
            <p className="text-slate-600">Your latest financial activity</p>
          </div>
        </div>
        <button 
          className="group relative overflow-hidden rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
          onClick={() => setShowAdd(true)}
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
      
      <div className="space-y-4">
        {recentTransactions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Plus className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No transactions yet</h3>
            <p className="text-slate-500 mb-6">Add your first transaction to get started</p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Add Transaction
            </button>
          </div>
        )}
        
        {recentTransactions.map((transaction, index) => (
          <div key={transaction.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 to-white p-6 border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-6">
              {/* Icon */}
              <div className={`relative flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                transaction.type === 'income' 
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500' 
                  : 'bg-gradient-to-br from-rose-400 to-red-500'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="w-7 h-7 text-white" />
                ) : (
                  <ArrowDownRight className="w-7 h-7 text-white" />
                )}
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 text-lg mb-2 truncate">
                  {transaction.description}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {transaction.category}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500">{transaction.date}</span>
                </div>
              </div>
              
              {/* Amount */}
              <div className={`text-right font-bold text-2xl ${
                transaction.type === 'income' 
                  ? 'text-emerald-600' 
                  : 'text-rose-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount, settings?.currency || 'USD')}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  className="p-3 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 hover:border-slate-300"
                  onClick={() => handleEdit(transaction)}
                  aria-label="Edit transaction"
                >
                  <Edit3 className="w-5 h-5 text-slate-600" />
                </button>
                <button 
                  className="p-3 rounded-xl hover:bg-rose-50 transition-colors border border-rose-200 hover:border-rose-300"
                  onClick={() => handleDelete(transaction.id)}
                  aria-label="Delete transaction"
                >
                  <Trash2 className="w-5 h-5 text-rose-600" />
                </button>
              </div>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
