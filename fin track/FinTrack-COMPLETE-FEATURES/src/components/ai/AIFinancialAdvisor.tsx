import React, { useState, useEffect } from 'react'
import { deepSeekAI, FinancialInsight, FinancialData } from '../../lib/ai/deepseek'
import { Brain, TrendingUp, Target, AlertCircle, CheckCircle, Loader2, Sparkles } from 'lucide-react'

interface AIFinancialAdvisorProps {
  financialData: FinancialData
  onInsightUpdate?: (insights: FinancialInsight[]) => void
}

export const AIFinancialAdvisor: React.FC<AIFinancialAdvisorProps> = ({ 
  financialData, 
  onInsightUpdate 
}) => {
  const [insights, setInsights] = useState<FinancialInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'spending' | 'budget' | 'health' | 'savings'>('overview')

  useEffect(() => {
    generateInsights()
  }, [financialData])

  const generateInsights = async () => {
    setLoading(true)
    try {
      const [
        spendingAnalysis,
        budgetRecommendations,
        financialHealth,
        savingsAdvice
      ] = await Promise.all([
        deepSeekAI.analyzeSpendingPatterns(financialData),
        deepSeekAI.getBudgetRecommendations(financialData),
        deepSeekAI.calculateFinancialHealthScore(financialData),
        deepSeekAI.getSavingsAdvice(financialData)
      ])

      const newInsights = [spendingAnalysis, budgetRecommendations, financialHealth, savingsAdvice]
      setInsights(newInsights)
      onInsightUpdate?.(newInsights)
    } catch (error) {
      console.error('Error generating AI insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />
      case 'medium': return <Target className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return <TrendingUp className="w-4 h-4" />
    }
  }

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-600 dark:text-gray-400'
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Brain className="w-4 h-4" /> },
    { id: 'spending', label: 'Spending', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'budget', label: 'Budget', icon: <Target className="w-4 h-4" /> },
    { id: 'health', label: 'Health', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'savings', label: 'Savings', icon: <Sparkles className="w-4 h-4" /> }
  ]

  const filteredInsights = insights.filter(insight => {
    if (activeTab === 'overview') return true
    return insight.type.includes(activeTab as any)
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Financial Advisor
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by DeepSeek AI
            </p>
          </div>
        </div>
        
        {loading && (
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-4">
        {filteredInsights.map((insight, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getPriorityIcon(insight.priority)}
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {insight.title}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)} bg-opacity-10`}>
                  {insight.priority}
                </span>
              </div>
              {insight.score && (
                <div className={`text-2xl font-bold ${getScoreColor(insight.score)}`}>
                  {insight.score}
                </div>
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {insight.message}
            </p>

            {insight.recommendations && insight.recommendations.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Recommendations:
                </h5>
                <ul className="space-y-1">
                  {insight.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-blue-800 dark:text-blue-200 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {insights.length === 0 && !loading && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No financial data available for AI analysis
          </p>
        </div>
      )}
    </div>
  )
}
