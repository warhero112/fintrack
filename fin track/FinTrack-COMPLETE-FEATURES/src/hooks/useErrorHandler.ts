import { useCallback } from 'react'
import { useAppStore } from '../stores/appStore'
import { toast } from 'sonner'

export const useErrorHandler = () => {
  const { setError, setLoading } = useAppStore()

  const handleError = useCallback((error: unknown, context?: string) => {
    console.error('Error:', error)
    
    let message = 'An unexpected error occurred'
    
    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }
    
    if (context) {
      message = `${context}: ${message}`
    }
    
    setError(message)
    setLoading(false)
    
    // Show toast notification
    toast.error(message, {
      duration: 5000,
      action: {
        label: 'Dismiss',
        onClick: () => setError(null),
      },
    })
  }, [setError, setLoading])

  const handleSuccess = useCallback((message: string) => {
    setError(null)
    setLoading(false)
    toast.success(message, { duration: 3000 })
  }, [setError, setLoading])

  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  return {
    handleError,
    handleSuccess,
    clearError,
  }
}
