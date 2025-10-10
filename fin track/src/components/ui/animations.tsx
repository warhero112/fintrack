import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Animation variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 }
}

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
}

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Animated components
export const AnimatedCard: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
}> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

export const AnimatedList: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    className={className}
  >
    {children}
  </motion.div>
)

export const AnimatedListItem: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => (
  <motion.div
    variants={slideUp}
    className={className}
  >
    {children}
  </motion.div>
)

export const AnimatedModal: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  className?: string
}> = ({ children, isOpen, className = '' }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={className}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

export const AnimatedCounter: React.FC<{
  value: number
  duration?: number
  className?: string
}> = ({ value, duration = 1, className = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    const startTime = Date.now()
    const startValue = displayValue
    const difference = value - startValue

    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      
      const currentValue = startValue + (difference * progress)
      setDisplayValue(Math.round(currentValue))
      
      if (progress >= 1) {
        clearInterval(timer)
      }
    }, 16) // ~60fps

    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <motion.span
      className={className}
      key={value}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  )
}

export const AnimatedProgress: React.FC<{
  value: number
  max?: number
  className?: string
  color?: string
}> = ({ value, max = 100, className = '', color = 'bg-primary' }) => {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <motion.div
        className={`h-2 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  )
}

export const AnimatedIcon: React.FC<{
  children: React.ReactNode
  className?: string
  hover?: boolean
}> = ({ children, className = '', hover = true }) => (
  <motion.div
    className={className}
    whileHover={hover ? { scale: 1.1, rotate: 5 } : {}}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
)

export const AnimatedButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}> = ({ children, onClick, className = '', disabled = false }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={className}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.button>
)
