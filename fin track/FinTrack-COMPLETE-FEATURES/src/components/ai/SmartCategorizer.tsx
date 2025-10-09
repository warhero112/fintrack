import React, { useState } from 'react'
import { deepSeekAI } from '../../lib/ai/deepseek'
import { Brain, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface SmartCategorizerProps {
  description: string
  amount: number
  onCategorySelected: (category: string) => void
  onClose: () => void
}

export const SmartCategorizer: React.FC<SmartCategorizerProps> = ({
  description,
  amount,
  onCategorySelected,
  onClose
}) => {
  const [loading, setLoading] = useState(false)
  const [suggestedCategory, setSuggestedCategory] = useState<string>('')
  const [confidence, setConfidence] = useState<number>(0)

  const categories = [
    'Food', 'Transport', 'Shopping', 'Bills', 'Utilities', 
    'Health', 'Entertainment', 'Travel', 'Education', 'Other', 
    'Salary', 'Bonus'
  ]

  const categorizeTransaction = async () => {
    setLoading(true)
    try {
      const category = await deepSeekAI.categorizeTransaction(description, amount)
      setSuggestedCategory(category)
      
      // Calculate confidence based on description length and amount
      const confidenceScore = Math.min(95, Math.max(60, 
        (description.length * 2) + (amount > 100 ? 20 : 10)
      ))
      setConfidence(confidenceScore)
    } catch (error) {
      console.error('Error categorizing transaction:', error)
      setSuggestedCategory('Other')
      setConfidence(50)
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-600 dark:text-green-400'
    if (conf >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getConfidenceIcon = (conf: number) => {
    if (conf >= 80) return <CheckCircle className="w-4 h-4" />
    if (conf >= 60) return <AlertCircle className="w-4 h-4" />
    return <AlertCircle className="w-4 h-4" />
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Category Suggestion
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Transaction:</p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="font-medium text-gray-900 dark:text-white">
              {description}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Amount: ${amount}
            </p>
          </div>
        </div>

        {!suggestedCategory && !loading && (
          <div className="text-center py-4">
            <button
              onClick={categorizeTransaction}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
            >
              <Brain className="w-4 h-4" />
              <span>Get AI Suggestion</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI is analyzing your transaction...
            </p>
          </div>
        )}

        {suggestedCategory && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  AI Suggestion
                </h4>
                <div className={`flex items-center space-x-1 ${getConfidenceColor(confidence)}`}>
                  {getConfidenceIcon(confidence)}
                  <span className="text-sm font-medium">{confidence}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {suggestedCategory}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Or choose from all categories:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategorySelected(category)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      category === suggestedCategory
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => onCategorySelected(suggestedCategory)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Use AI Suggestion
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
