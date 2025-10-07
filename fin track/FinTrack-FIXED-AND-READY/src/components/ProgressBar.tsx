import React from 'react'
import { CheckCircle, Circle } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Setting up FinTrack
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          We're preparing your personal finance app with authentication and mobile features
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress: {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep - 1
          
          return (
            <div 
              key={index}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : isCurrent
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className={`flex-shrink-0 ${
                isCompleted ? 'text-green-600 dark:text-green-400' : 
                isCurrent ? 'text-blue-600 dark:text-blue-400' : 
                'text-gray-400 dark:text-gray-500'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`font-medium ${
                  isCompleted ? 'text-green-900 dark:text-green-100' :
                  isCurrent ? 'text-blue-900 dark:text-blue-100' :
                  'text-gray-700 dark:text-gray-300'
                }`}>
                  {step}
                </p>
                {isCurrent && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    In progress...
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
