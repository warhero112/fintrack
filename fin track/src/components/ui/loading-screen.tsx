import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, TrendingUp, Globe, ArrowRight, Zap } from 'lucide-react'

interface LoadingScreenProps {
  isVisible: boolean
  progress?: number
  message?: string
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  isVisible, 
  progress = 0, 
  message = "Loading your financial data..." 
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [moneyParticles, setMoneyParticles] = useState<Array<{
    id: number
    x: number
    y: number
    delay: number
    size: number
  }>>([])

  const steps = [
    "Connecting to global markets...",
    "Analyzing financial trends...",
    "Processing transaction data...",
    "Calculating insights...",
    "Preparing your dashboard..."
  ]

  // Generate money particles
  useEffect(() => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 8 + 4
    }))
    setMoneyParticles(particles)
  }, [])

  // Cycle through steps
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [isVisible, steps.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  }

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  }

  const moneyFlowVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut"
      }
    }
  }

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (delay: number) => ({
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [0, -50, -100],
      transition: {
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeOut"
      }
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center z-50"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }} />
            </div>
          </div>

          {/* Money Flow Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              width="400" 
              height="300" 
              viewBox="0 0 400 300" 
              className="absolute"
            >
              {/* Global Money Flow Paths */}
              <motion.path
                d="M50,150 Q200,50 350,150"
                stroke="url(#gradient1)"
                strokeWidth="3"
                fill="none"
                variants={moneyFlowVariants}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M50,200 Q200,100 350,200"
                stroke="url(#gradient2)"
                strokeWidth="2"
                fill="none"
                variants={moneyFlowVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
              />
              <motion.path
                d="M50,100 Q200,200 350,100"
                stroke="url(#gradient3)"
                strokeWidth="2"
                fill="none"
                variants={moneyFlowVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1 }}
              />

              {/* Money Flow Arrows */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <motion.path
                  d="M100,150 L120,140 L120,160 Z"
                  fill="#10b981"
                  animate={{ x: [0, 200, 0] }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
                <motion.path
                  d="M150,200 L170,190 L170,210 Z"
                  fill="#3b82f6"
                  animate={{ x: [0, 150, 0] }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 0.5
                  }}
                />
                <motion.path
                  d="M200,100 L220,90 L220,110 Z"
                  fill="#f59e0b"
                  animate={{ x: [0, 100, 0] }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 1
                  }}
                />
              </motion.g>

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#84cc16" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Money Particles */}
          {moneyParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-green-400"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                fontSize: `${particle.size}px`
              }}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
              custom={particle.delay}
            >
              <DollarSign className="w-full h-full" />
            </motion.div>
          ))}

          {/* Main Content */}
          <div className="relative z-10 text-center">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <Globe className="w-10 h-10 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <TrendingUp className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* App Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold text-white mb-2"
            >
              FinTrack
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-blue-200 text-lg mb-8"
            >
              Global Financial Intelligence
            </motion.p>

            {/* Loading Steps */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">
                  {steps[currentStep]}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-80 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Global Flow Indicators */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center gap-8 text-sm text-blue-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Income</span>
              </div>
              <ArrowRight className="w-4 h-4" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>Investments</span>
              </div>
              <ArrowRight className="w-4 h-4" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span>Growth</span>
              </div>
            </motion.div>

            {/* Loading Message */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-blue-300 text-sm mt-6"
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
