import { Pencil, Trash2, Plus, DollarSign, Wallet, ShoppingCart, Zap, Briefcase, UtensilsCrossed } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Transaction, useAppStore } from '../store/appStore';
import { useState } from 'react';

interface RecentTransactionsProps {
  transactions: Transaction[];
  limit?: number;
}

export function RecentTransactions({ transactions, limit = 5 }: RecentTransactionsProps) {
  const { deleteTransaction, setEditingTransaction, setShowAdd } = useAppStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const recentTransactions = transactions.slice(0, limit);

  const getIcon = (iconName?: string) => {
    if (!iconName) return DollarSign;
    const Icon = (Icons as any)[iconName];
    return Icon || DollarSign;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowAdd(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  if (recentTransactions.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3>Recent Transactions</h3>
        </div>
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
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3>Recent Transactions</h3>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-sm hover:bg-slate-700 transition-all"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {recentTransactions.map((transaction) => {
          const Icon = getIcon(transaction.icon);
          const isIncome = transaction.type === 'income';
          const bgColor = isIncome ? 'bg-emerald-100' : 'bg-rose-100';
          const iconColor = isIncome ? 'text-emerald-700' : 'text-rose-700';
          const isHovered = hoveredId === transaction.id;

          return (
            <div
              key={transaction.id}
              onMouseEnter={() => setHoveredId(transaction.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative rounded-2xl bg-slate-50 p-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-8 h-8 ${iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-slate-900 truncate">{transaction.description}</h4>
                    <span className={`${isIncome ? 'text-emerald-600' : 'text-rose-600'} whitespace-nowrap`}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm">{formatDate(transaction.date)}</span>
                    <span className="text-slate-400">•</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-slate-200 text-slate-700">
                      {transaction.category}
                    </span>
                  </div>
                </div>

                {isHovered && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}