import React from 'react'
import { Camera, Plus, Brain } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'

export const QuickActions: React.FC = () => {
  const { setShowBillScanner, setShowAdd, setShowAICategorizer } = useAppStore()

  return (
    <div className="rounded-2xl shadow-sm border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setShowBillScanner(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          aria-label="Scan receipt"
        >
          <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Scan Bill
          </span>
        </button>
        
        <button
          onClick={() => setShowAdd(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          aria-label="Add transaction"
        >
          <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-900 dark:text-green-100">
            Add Expense
          </span>
        </button>
        
        <button
          onClick={() => setShowAICategorizer(true)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          aria-label="AI categorization"
        >
          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
            AI Help
          </span>
        </button>
      </div>
    </div>
  )
}
