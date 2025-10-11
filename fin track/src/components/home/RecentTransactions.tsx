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
    <div className="space-y-0">

      {recentTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">No transactions yet</p>
          <p className="text-sm text-gray-400">Add your first transaction to get started</p>
        </div>
      )}
      
      {recentTransactions.map((transaction) => {
        const isIncome = transaction.type === 'income';

        return (
          <div key={transaction.id} className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
            <div className="flex items-center gap-4">
              <div className="text-[#111418] flex items-center justify-center rounded-lg bg-[#f0f2f4] shrink-0 size-12" data-icon="ForkKnife" data-size="24px" data-weight="regular">
                {isIncome ? (
                  <ArrowUpRight className="w-6 h-6 text-[#111418]" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 text-[#111418]" />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">{transaction.description}</p>
                <p className="text-[#617589] text-sm font-normal leading-normal line-clamp-2">{transaction.category}</p>
              </div>
            </div>
            <div className="shrink-0">
              <p className="text-[#111418] text-base font-normal leading-normal">
                {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, settings?.currency || 'USD')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  )
}
