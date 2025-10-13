import React from 'react'
import { Plus, X } from 'lucide-react'
import { useAppStore } from '../stores/appStore'
import { Button } from './ui/button'

export const FloatingActionButton: React.FC = () => {
  const { setShowAdd } = useAppStore()

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Button
        onClick={() => setShowAdd(true)}
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
