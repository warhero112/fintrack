import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  RefreshCw, 
  Globe, 
  TrendingUp, 
  DollarSign, 
  ArrowRight,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react'

interface RefreshScenarioProps {
  isVisible: boolean
  onComplete: () => void
}

export const RefreshScenario: React.FC<RefreshScenarioProps> = ({ 
  isVisible, 
  onComplete 
}) => {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [moneyFlows, setMoneyFlows] = useState<Array<{
    id: number
    from: { x: number; y: number; country: string }
    to: { x: number; y: number; country: string }
    amount: number
    color: string
  }>>([])

  const phases = [
    {
      title: "Global Market Analysis",
      description: "Analyzing real-time financial data from major markets",
      icon: Globe,
      duration: 2000
    },
    {
      title: "Transaction Processing",
      description: "Processing millions of transactions across the globe",
      icon: Activity,
      duration: 2500
    },
    {
      title: "Trend Calculation",
      description: "Calculating spending patterns and financial trends",
      icon: TrendingUp,
      duration: 2000
    },
    {
      title: "Insights Generation",
      description: "Generating personalized financial insights",
      icon: BarChart3,
      duration: 1500
    }
  ]

  // Generate money flow data
  useEffect(() => {
    const flows = [
      {
        id: 1,
        from: { x: 20, y: 30, country: "USA" },
        to: { x: 80, y: 40, country: "EU" },
        amount: 2.5,
        color: "#10b981"
      },
      {
        id: 2,
        from: { x: 15, y: 60, country: "Asia" },
        to: { x: 85, y: 25, country: "USA" },
        amount: 1.8,
        color: "#3b82f6"
      },
      {
        id: 3,
        from: { x: 25, y: 70, country: "Africa" },
        to: { x: 75, y: 50, country: "EU" },
        amount: 0.9,
        color: "#f59e0b"
      },
      {
        id: 4,
        from: { x: 30, y: 20, country: "Canada" },
        to: { x: 70, y: 65, country: "Asia" },
        amount: 1.2,
        color: "#8b5cf6"
      },
      {
        id: 5,
        from: { x: 40, y: 80, country: "Australia" },
        to: { x: 60, y: 35, country: "USA" },
        amount: 0.7,
        color: "#ef4444"
      }
    ]
    setMoneyFlows(flows)
  }, [])

  // Progress through phases
  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      if (currentPhase < phases.length - 1) {
        setCurrentPhase(prev => prev + 1)
      } else {
        onComplete()
      }
    }, phases[currentPhase]?.duration || 2000)

    return () => clearTimeout(timer)
  }, [currentPhase, isVisible, onComplete])

  const currentPhaseData = phases[currentPhase]
  const Icon = currentPhaseData?.icon || Globe

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }} />
            </div>
          </div>

          {/* Global Money Flow Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 100 100" 
              className="absolute"
            >
              {/* Money Flow Lines */}
              {moneyFlows.map((flow, index) => (
                <motion.g key={flow.id}>
                  <motion.line
                    x1={`${flow.from.x}%`}
                    y1={`${flow.from.y}%`}
                    x2={`${flow.to.x}%`}
                    y2={`${flow.to.y}%`}
                    stroke={flow.color}
                    strokeWidth="0.5"
                    opacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ 
                      duration: 2, 
                      delay: index * 0.3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  
                  {/* Animated Money Particles */}
                  <motion.circle
                    cx={`${flow.from.x + (flow.to.x - flow.from.x) * 0.5}%`}
                    cy={`${flow.from.y + (flow.to.y - flow.from.y) * 0.5}%`}
                    r="0.5"
                    fill={flow.color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [`${(flow.to.x - flow.from.x) * 0.5}%`, `${(flow.to.x - flow.from.x) * 0.5}%`],
                      y: [`${(flow.to.y - flow.from.y) * 0.5}%`, `${(flow.to.y - flow.from.y) * 0.5}%`]
                    }}
                    transition={{ 
                      duration: 3,
                      delay: index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.g>
              ))}

              {/* Country Nodes */}
              {moneyFlows.map((flow) => (
                <g key={`node-${flow.id}`}>
                  <motion.circle
                    cx={`${flow.from.x}%`}
                    cy={`${flow.from.y}%`}
                    r="1.5"
                    fill={flow.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ 
                      duration: 0.5,
                      delay: 0.5
                    }}
                  />
                  <motion.circle
                    cx={`${flow.to.x}%`}
                    cy={`${flow.to.y}%`}
                    r="1.5"
                    fill={flow.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ 
                      duration: 0.5,
                      delay: 0.7
                    }}
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <RefreshCw className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                Refreshing Global Data
              </h1>
              <p className="text-blue-200">
                Connecting to worldwide financial networks
              </p>
            </motion.div>

            {/* Current Phase */}
            <motion.div
              key={currentPhase}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">
                  {currentPhaseData?.title}
                </h2>
              </div>
              
              <p className="text-blue-300 mb-6">
                {currentPhaseData?.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: (currentPhaseData?.duration || 2000) / 1000,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>

            {/* Global Flow Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">$2.4T</div>
                <div className="text-xs text-blue-300">Daily Volume</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Globe className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">195</div>
                <div className="text-xs text-blue-300">Countries</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">50M+</div>
                <div className="text-xs text-blue-300">Transactions</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-xs text-blue-300">Uptime</div>
              </div>
            </motion.div>

            {/* Flow Indicators */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-6 text-sm text-blue-200"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Income</span>
              </div>
              <ArrowRight className="w-4 h-4" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>Processing</span>
              </div>
              <ArrowRight className="w-4 h-4" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span>Insights</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
