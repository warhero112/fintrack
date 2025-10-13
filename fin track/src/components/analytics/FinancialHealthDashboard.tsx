import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { TrendingUp, TrendingDown, Minus, Heart, AlertCircle, CheckCircle } from 'lucide-react'
import { calculateFinancialHealth, FinancialHealthScore } from '../../lib/analytics/financialHealth'
import { useAppStore } from '../../stores/appStore'

export const FinancialHealthDashboard: React.FC = () => {
  const { transactions, goals, budgets } = useAppStore()
  
  const healthScore = calculateFinancialHealth(transactions, goals, budgets)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getOverallStatus = (score: number) => {
    if (score >= 80) return { text: 'Excellent', icon: CheckCircle, color: 'text-green-600' }
    if (score >= 60) return { text: 'Good', icon: Heart, color: 'text-yellow-600' }
    return { text: 'Needs Attention', icon: AlertCircle, color: 'text-red-600' }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const overallStatus = getOverallStatus(healthScore.overall)
  const StatusIcon = overallStatus.icon

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="relative inline-flex">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(healthScore.overall)}`}>
                    {healthScore.overall}
                  </div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-8 border-transparent"
                   style={{
                     borderTopColor: healthScore.overall >= 80 ? '#10b981' : 
                                   healthScore.overall >= 60 ? '#f59e0b' : '#ef4444',
                     transform: `rotate(${(healthScore.overall / 100) * 360 - 90}deg)`,
                     transition: 'transform 0.5s ease-in-out'
                   }}
              />
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <StatusIcon className={`w-5 h-5 ${overallStatus.color}`} />
              <span className={`text-lg font-semibold ${overallStatus.color}`}>
                {overallStatus.text}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Health Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(healthScore.categories).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="capitalize font-medium">{category}</span>
                <div className="flex items-center gap-2">
                  <Badge className={`${getScoreBgColor(score)} ${getScoreColor(score)}`}>
                    {score}/100
                  </Badge>
                </div>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {getTrendIcon(healthScore.trends.spending)}
              <div>
                <div className="font-medium">Spending</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {healthScore.trends.spending}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(healthScore.trends.saving)}
              <div>
                <div className="font-medium">Saving</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {healthScore.trends.saving}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getTrendIcon(healthScore.trends.budgeting)}
              <div>
                <div className="font-medium">Budgeting</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {healthScore.trends.budgeting}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthScore.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
