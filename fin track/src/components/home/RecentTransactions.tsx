import React from 'react'
import { useAppStore } from '../../stores/appStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Trash2,
  CreditCard,
  ShoppingCart,
  Car,
  Home,
  Utensils,
  Gamepad2
} from 'lucide-react'

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

const getCategoryIcon = (category: string) => {
  const categoryIcons: { [key: string]: any } = {
    'Food': Utensils,
    'Transport': Car,
    'Shopping': ShoppingCart,
    'Entertainment': Gamepad2,
    'Bills': Home,
    'Other': CreditCard
  }
  return categoryIcons[category] || CreditCard
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Food': 'bg-orange-100 text-orange-700',
    'Transport': 'bg-blue-100 text-blue-700',
    'Shopping': 'bg-purple-100 text-purple-700',
    'Entertainment': 'bg-pink-100 text-pink-700',
    'Bills': 'bg-red-100 text-red-700',
    'Other': 'bg-gray-100 text-gray-700'
  }
  return colors[category] || 'bg-gray-100 text-gray-700'
}

export const RecentTransactions: React.FC = () => {
  const { 
    transactions, 
    setShowAdd, 
    deleteTransaction, 
    setEditingTransaction,
    settings 
  } = useAppStore()

  const safeTransactions = transactions || []
  const recentTransactions = safeTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setShowAdd(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id)
    }
  }

  return (
    <div className="space-y-4">
      {recentTransactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first transaction</p>
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => {
            const isIncome = transaction.type === 'income'
            const CategoryIcon = getCategoryIcon(transaction.category)
            const categoryColor = getCategoryColor(transaction.category)

            return (
              <div 
                key={transaction.id} 
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
              >
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {isIncome ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{transaction.description}</h4>
                    <Badge variant="secondary" className={`text-xs ${categoryColor}`}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {transaction.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className={`font-semibold ${
                    isIncome ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {isIncome ? '+' : '-'}
                    {formatCurrency(transaction.amount, settings?.currency || 'USD')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}