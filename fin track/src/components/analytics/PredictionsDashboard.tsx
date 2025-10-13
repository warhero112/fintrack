import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  DollarSign
} from 'lucide-react'
import { 
  predictSpending, 
  predictGoalCompletion, 
  predictBudgetOverspend,
  SpendingPrediction,
  GoalPrediction
} from '../../lib/analytics/predictions'
import { useAppStore } from '../../stores/appStore'
import { formatCurrency, formatDate } from '../../lib/utils'

export const PredictionsDashboard: React.FC = () => {
  const { transactions, goals, budgets } = useAppStore()
  
  const spendingPrediction = predictSpending(transactions)
  const goalPredictions = predictGoalCompletion(goals, transactions)
  const budgetPredictions = predictBudgetOverspend(budgets, transactions)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-600" />
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Spending Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Spending Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(spendingPrediction.nextMonth)}
              </div>
              <div className="text-sm text-muted-foreground">Next Month</div>
              <Badge className={`mt-2 ${getConfidenceColor(spendingPrediction.confidence)}`}>
                {spendingPrediction.confidence}% confidence
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(spendingPrediction.nextQuarter)}
              </div>
              <div className="text-sm text-muted-foreground">Next Quarter</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(spendingPrediction.nextYear)}
              </div>
              <div className="text-sm text-muted-foreground">Next Year</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            {getTrendIcon(spendingPrediction.trend)}
            <span className="capitalize font-medium">
              Spending trend: {spendingPrediction.trend}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Key Factors:</div>
            {spendingPrediction.factors.map((factor, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-primary" />
                {factor}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goal Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goal Completion Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goalPredictions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No goals to predict
            </div>
          ) : (
            <div className="space-y-4">
              {goalPredictions.map((prediction) => {
                const goal = goals.find(g => g.id === prediction.goalId)
                if (!goal) return null
                
                return (
                  <div key={prediction.goalId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{goal.title}</h4>
                      <div className="flex items-center gap-2">
                        {prediction.isOnTrack ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                        <Badge className={getConfidenceColor(prediction.confidence)}>
                          {prediction.confidence}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{prediction.currentProgress}%</span>
                      </div>
                      <Progress value={prediction.currentProgress} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Predicted Completion</div>
                          <div className="font-medium">
                            {formatDate(prediction.predictedCompletionDate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Required Monthly</div>
                          <div className="font-medium">
                            {formatCurrency(prediction.requiredMonthlyContribution)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Budget Overspend Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {budgetPredictions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No budgets to predict
            </div>
          ) : (
            <div className="space-y-4">
              {budgetPredictions.map((prediction) => (
                <div key={prediction.budgetId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{prediction.category}</h4>
                    <Badge className={getConfidenceColor(prediction.confidence)}>
                      {prediction.confidence}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Spending</span>
                      <span>{formatCurrency(prediction.currentSpent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Limit</span>
                      <span>{formatCurrency(prediction.monthlyLimit)}</span>
                    </div>
                    
                    {prediction.predictedOverspend > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <div className="flex items-center gap-2 text-red-800 font-medium mb-1">
                          <AlertTriangle className="w-4 h-4" />
                          Predicted Overspend: {formatCurrency(prediction.predictedOverspend)}
                        </div>
                        <div className="text-sm text-red-700">
                          {prediction.recommendations[0]}
                        </div>
                      </div>
                    )}
                    
                    {prediction.predictedOverspend === 0 && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <div className="flex items-center gap-2 text-green-800 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          On track to stay within budget
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
