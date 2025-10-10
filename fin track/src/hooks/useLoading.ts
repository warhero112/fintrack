import { useState, useEffect } from 'react'

interface LoadingState {
  isVisible: boolean
  progress: number
  message: string
  step: number
}

export const useLoading = (initialVisible = true) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isVisible: initialVisible,
    progress: 0,
    message: "Initializing FinTrack...",
    step: 0
  })

  const steps = [
    { message: "Connecting to global markets...", progress: 20 },
    { message: "Analyzing financial trends...", progress: 40 },
    { message: "Processing transaction data...", progress: 60 },
    { message: "Calculating insights...", progress: 80 },
    { message: "Preparing your dashboard...", progress: 100 }
  ]

  const startLoading = (message?: string) => {
    setLoadingState({
      isVisible: true,
      progress: 0,
      message: message || "Loading...",
      step: 0
    })
  }

  const updateProgress = (progress: number, message?: string) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
      message: message || prev.message
    }))
  }

  const nextStep = () => {
    setLoadingState(prev => {
      const nextStepIndex = Math.min(prev.step + 1, steps.length - 1)
      return {
        ...prev,
        step: nextStepIndex,
        message: steps[nextStepIndex].message,
        progress: steps[nextStepIndex].progress
      }
    })
  }

  const completeLoading = () => {
    setLoadingState(prev => ({
      ...prev,
      progress: 100,
      message: "Welcome to FinTrack!"
    }))
    
    // Hide loading screen after a brief delay
    setTimeout(() => {
      setLoadingState(prev => ({
        ...prev,
        isVisible: false
      }))
    }, 1000)
  }

  const hideLoading = () => {
    setLoadingState(prev => ({
      ...prev,
      isVisible: false
    }))
  }

  // Auto-progress through steps
  useEffect(() => {
    if (!loadingState.isVisible) return

    const interval = setInterval(() => {
      setLoadingState(prev => {
        if (prev.step >= steps.length - 1) {
          clearInterval(interval)
          return prev
        }

        const nextStepIndex = prev.step + 1
        return {
          ...prev,
          step: nextStepIndex,
          message: steps[nextStepIndex].message,
          progress: steps[nextStepIndex].progress
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [loadingState.isVisible, loadingState.step])

  return {
    ...loadingState,
    startLoading,
    updateProgress,
    nextStep,
    completeLoading,
    hideLoading
  }
}
