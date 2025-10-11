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
    <div className="rounded-2xl bg-white p-8 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-900">Recent Transactions</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm hover:bg-slate-700 transition-all"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {recentTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-600 mb-4">No transactions yet</p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all"
            >
              Add First Transaction
            </button>
          </div>
        )}
        
        {recentTransactions.map((transaction) => {
          const isIncome = transaction.type === 'income';
          const bgColor = isIncome ? 'bg-emerald-100' : 'bg-rose-100';
          const iconColor = isIncome ? 'text-emerald-700' : 'text-rose-700';

          return (
            <div
              key={transaction.id}
              className="relative rounded-2xl bg-slate-50 p-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
                  {isIncome ? (
                    <ArrowUpRight className={`w-8 h-8 ${iconColor}`} />
                  ) : (
                    <ArrowDownRight className={`w-8 h-8 ${iconColor}`} />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-slate-900 truncate">{transaction.description}</h4>
                    <span className={`${isIncome ? 'text-emerald-600' : 'text-rose-600'} whitespace-nowrap`}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, settings?.currency || 'USD')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">{transaction.date}</span>
                    <span className="text-slate-400">•</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-slate-200 text-slate-700">
                      {transaction.category}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
