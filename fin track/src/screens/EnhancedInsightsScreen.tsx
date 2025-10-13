import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Brain, 
  PieChart,
  Activity,
  Zap
} from 'lucide-react'
import { FinancialHealthDashboard } from '../components/analytics/FinancialHealthDashboard'
import { PredictionsDashboard } from '../components/analytics/PredictionsDashboard'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { TrendsChart } from '../components/analytics/TrendsChart'
import { SearchAndFilter } from '../components/SearchAndFilter'

export const EnhancedInsightsScreen: React.FC<{ isMobileView: boolean }> = ({ isMobileView }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'predictions' | 'trends' | 'categories'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'health', label: 'Health Score', icon: Activity },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'trends', label: 'Trends', icon: PieChart },
    { id: 'categories', label: 'Categories', icon: Target }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Quick Health Check
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialHealthDashboard />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Spending Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendsChart />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart />
              </CardContent>
            </Card>
          </div>
        )
      
      case 'health':
        return <FinancialHealthDashboard />
      
      case 'predictions':
        return <PredictionsDashboard />
      
      case 'trends':
        return (
          <div className="space-y-6">
            <TrendsChart />
            <CategoryChart />
          </div>
        )
      
      case 'categories':
        return (
          <div className="space-y-6">
            <SearchAndFilter />
            <CategoryChart />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={`space-y-6 ${isMobileView ? 'px-4 pb-28' : 'px-6 pb-8'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Insights</h1>
          <p className="text-muted-foreground">
            Advanced analytics and predictions for your financial health
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}
