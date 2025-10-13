import React, { useState } from 'react'
import { Sparkles, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { useAppStore } from '../../stores/appStore'
import { logger } from '../../lib/logger'

interface SmartCategorizerProps {
  onClose: () => void
}

export const SmartCategorizer: React.FC<SmartCategorizerProps> = ({ onClose }) => {
  const { transactions, categories, updateTransaction } = useAppStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{
    transactionId: string
    currentCategory: string
    suggestedCategory: string
    confidence: number
    reason: string
  }>>([])

  const analyzeTransactions = async () => {
    setIsAnalyzing(true)
    try {
      // Simulate AI categorization
      const uncategorized = transactions.filter(t => 
        !t.category || t.category === 'Other' || t.category === ''
      )
      
      const mockSuggestions = uncategorized.slice(0, 5).map(transaction => {
        const suggestedCategory = getSuggestedCategory(transaction.description)
        return {
          transactionId: transaction.id,
          currentCategory: transaction.category || 'Uncategorized',
          suggestedCategory,
          confidence: Math.random() * 0.4 + 0.6, // 60-100% confidence
          reason: getCategorizationReason(transaction.description, suggestedCategory)
        }
      })
      
      setSuggestions(mockSuggestions)
      logger.info('Transaction categorization completed', { 
        analyzed: uncategorized.length,
        suggestions: mockSuggestions.length 
      })
    } catch (error) {
      logger.error('Error categorizing transactions', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSuggestedCategory = (description: string): string => {
    const desc = description.toLowerCase()
    
    if (desc.includes('grocery') || desc.includes('food') || desc.includes('restaurant')) {
      return 'Food & Dining'
    }
    if (desc.includes('gas') || desc.includes('fuel') || desc.includes('transport')) {
      return 'Transportation'
    }
    if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('subscription')) {
      return 'Entertainment'
    }
    if (desc.includes('electric') || desc.includes('water') || desc.includes('utility')) {
      return 'Utilities'
    }
    if (desc.includes('rent') || desc.includes('mortgage') || desc.includes('housing')) {
      return 'Housing'
    }
    if (desc.includes('medical') || desc.includes('doctor') || desc.includes('health')) {
      return 'Healthcare'
    }
    if (desc.includes('salary') || desc.includes('payroll') || desc.includes('income')) {
      return 'Income'
    }
    
    return 'Other'
  }

  const getCategorizationReason = (description: string, category: string): string => {
    const reasons = {
      'Food & Dining': 'Contains food-related keywords',
      'Transportation': 'Contains transportation-related keywords',
      'Entertainment': 'Contains entertainment service keywords',
      'Utilities': 'Contains utility service keywords',
      'Housing': 'Contains housing-related keywords',
      'Healthcare': 'Contains healthcare-related keywords',
      'Income': 'Contains income-related keywords',
      'Other': 'No clear category indicators found'
    }
    
    return reasons[category as keyof typeof reasons] || 'Based on description analysis'
  }

  const applySuggestion = (transactionId: string, suggestedCategory: string) => {
    try {
      updateTransaction(transactionId, { category: suggestedCategory })
      setSuggestions(prev => prev.filter(s => s.transactionId !== transactionId))
      logger.info('Transaction category updated', { transactionId, category: suggestedCategory })
    } catch (error) {
      logger.error('Error updating transaction category', error)
    }
  }

  const applyAllSuggestions = () => {
    suggestions.forEach(suggestion => {
      applySuggestion(suggestion.transactionId, suggestion.suggestedCategory)
    })
    logger.info('All categorization suggestions applied', { count: suggestions.length })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Smart Categorizer
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Let AI help categorize your transactions based on descriptions and patterns.
          </p>
          
          {suggestions.length === 0 && !isAnalyzing && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Ready to analyze your transactions for better categorization?
              </p>
              <Button onClick={analyzeTransactions}>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Transactions
              </Button>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Analyzing transactions...</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {suggestions.length} categorization suggestions
                </p>
                <Button onClick={applyAllSuggestions} size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Apply All
                </Button>
              </div>

              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={suggestion.transactionId} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">
                          {transactions.find(t => t.id === suggestion.transactionId)?.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Current: {suggestion.currentCategory} → Suggested: {suggestion.suggestedCategory}
                        </p>
                      </div>
                      <Badge className={getConfidenceColor(suggestion.confidence)}>
                        {Math.round(suggestion.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {suggestion.reason}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => applySuggestion(suggestion.transactionId, suggestion.suggestedCategory)}
                      >
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSuggestions(prev => prev.filter((_, i) => i !== index))}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
