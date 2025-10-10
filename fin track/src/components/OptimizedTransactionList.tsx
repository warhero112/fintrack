import React, { Suspense } from 'react'
import { VirtualList } from './ui/virtual-list'
import { Loading } from './ui/loading'
import { Transaction } from '../types'
import { useAppStore } from '../stores/appStore'
import { formatCurrency } from '../lib/utils'
import { Button } from './ui/button'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

interface OptimizedTransactionListProps {
  className?: string
}

const TransactionItem: React.FC<{ 
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}> = ({ transaction, onEdit, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const getCategoryIcon = (category: string) => {
    // Simple icon mapping - you can expand this
    const icons: Record<string, string> = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Utilities': '⚡',
      'Housing': '🏠',
      'Healthcare': '🏥',
      'Income': '💰',
      'Other': '📝'
    }
    return icons[category] || '📝'
  }

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="text-2xl">{getCategoryIcon(transaction.category)}</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {transaction.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{transaction.category}</span>
              <span>•</span>
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${getTypeColor(transaction.type)}`}>
            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(transaction)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(transaction.id)
                setShowDeleteDialog(false)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const OptimizedTransactionList: React.FC<OptimizedTransactionListProps> = ({ 
  className = '' 
}) => {
  const { 
    getFilteredTransactions, 
    updateTransaction, 
    deleteTransaction, 
    setEditingTransaction 
  } = useAppStore()

  const transactions = getFilteredTransactions()

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
  }

  const handleDelete = (id: string) => {
    deleteTransaction(id)
  }

  const renderItem = (transaction: Transaction, index: number) => (
    <TransactionItem
      key={transaction.id}
      transaction={transaction}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
        <p className="text-muted-foreground">
          {transactions.length === 0 
            ? 'Start by adding your first transaction' 
            : 'Try adjusting your filters to see more results'
          }
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Transactions ({transactions.length})
        </h3>
      </div>
      
      <VirtualList
        items={transactions}
        itemHeight={80} // Height of each transaction item
        containerHeight={600} // Fixed container height
        renderItem={renderItem}
        className="border border-border rounded-lg"
        overscan={5}
      />
    </div>
  )
}

// Wrapped with Suspense for lazy loading
export const LazyOptimizedTransactionList: React.FC<OptimizedTransactionListProps> = (props) => (
  <Suspense fallback={<Loading text="Loading transactions..." />}>
    <OptimizedTransactionList {...props} />
  </Suspense>
)
