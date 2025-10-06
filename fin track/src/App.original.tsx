import React, { useState, useEffect } from 'react'
import { SetupProgress } from './components/SetupProgress'
import { AuthProvider } from './contexts/AuthContext'
import { AuthPage } from './components/auth/AuthPage'
import { Loader2 } from 'lucide-react'

// Import the original App component
import OriginalApp from './App.original'

function App() {
  const [showSetup, setShowSetup] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate setup completion after 16 seconds (8 steps × 2 seconds each)
    const setupTimer = setTimeout(() => {
      setShowSetup(false)
      setShowAuth(true)
    }, 16000)

    // Check authentication status
    const checkAuth = () => {
      const user = localStorage.getItem('supabase.auth.token')
      if (user) {
        setIsAuthenticated(true)
        setShowAuth(false)
      }
      setLoading(false)
    }

    checkAuth()

    return () => clearTimeout(setupTimer)
  }, [])

  if (showSetup) {
    return <SetupProgress />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading FinTrack...</p>
        </div>
      </div>
    )
  }

  if (showAuth && !isAuthenticated) {
    return (
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <OriginalApp />
    </AuthProvider>
  )
}

export default App
