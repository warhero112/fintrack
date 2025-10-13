import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {text && (
          <p className="text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    </div>
  )
}

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 className="w-6 h-6 animate-spin text-primary" />
  </div>
)

export const LoadingPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-foreground mb-2">Loading FinTrack</h2>
      <p className="text-muted-foreground">Please wait while we load your financial data...</p>
    </div>
  </div>
)
