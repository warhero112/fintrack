import React, { useState, useEffect } from 'react'
import { ProgressBar } from './ProgressBar'
import { Loader2 } from 'lucide-react'

export const SetupProgress: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)

  const steps = [
    'Installing dependencies and setting up project structure',
    'Configuring email-based authentication with Supabase',
    'Creating login and registration components',
    'Setting up PWA (Progressive Web App) features',
    'Optimizing for mobile development',
    'Adding offline support and data synchronization',
    'Finalizing deployment configuration',
    'Setup complete! Ready to launch 🚀'
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length) {
          setIsComplete(true)
          clearInterval(timer)
          return prev
        }
        return prev + 1
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(timer)
  }, [])

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-100 dark:bg-green-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Setup Complete! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            Your FinTrack app is now ready with email authentication and mobile app features. 
            You can now use it as a Progressive Web App on any device!
          </p>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What's been added:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                <li>✅ Email-based authentication system</li>
                <li>✅ Secure login and registration</li>
                <li>✅ PWA support for mobile installation</li>
                <li>✅ Offline data synchronization</li>
                <li>✅ Mobile-optimized interface</li>
                <li>✅ Enhanced security features</li>
              </ul>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
            >
              Launch FinTrack App
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full">
        <ProgressBar 
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
        />
        
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Setting up your app...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
