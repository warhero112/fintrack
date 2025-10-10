import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useAppStore } from '../../stores/appStore'
import { TimeSeriesDataPoint, TooltipProps } from '../../types'

export const TrendsChart: React.FC = () => {
  const { transactions } = useAppStore()

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const getChartData = (): TimeSeriesDataPoint[] => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      return date
    }).reverse()

    return last6Months.map(date => {
      const monthKey = date.toISOString().slice(0, 7) // YYYY-MM
      const monthTransactions = transactions.filter(t => 
        t.date.startsWith(monthKey)
      )

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: Math.round(income),
        expenses: Math.round(expenses),
        net: Math.round(income - expenses)
      }
    })
  }

  const data = getChartData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-lg font-semibold text-green-600">
              ${data.reduce((sum, d) => sum + d.income, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-semibold text-red-600">
              ${data.reduce((sum, d) => sum + d.expenses, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Net</p>
            <p className={`text-lg font-semibold ${
              data.reduce((sum, d) => sum + d.net, 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${data.reduce((sum, d) => sum + d.net, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
