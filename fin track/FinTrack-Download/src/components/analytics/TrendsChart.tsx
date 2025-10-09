import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAppStore } from '../../stores/appStore'

interface TrendData {
  month: string
  income: number
  expense: number
  net: number
}

export const TrendsChart: React.FC = () => {
  const { getFilteredTransactions } = useAppStore()
  const transactions = getFilteredTransactions()

  // Group transactions by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        income: 0,
        expense: 0,
        net: 0
      }
    }
    
    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount
    } else {
      acc[monthKey].expense += transaction.amount
    }
    
    acc[monthKey].net = acc[monthKey].income - acc[monthKey].expense
    
    return acc
  }, {} as Record<string, TrendData>)

  // Convert to array and sort by date
  const chartData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month + ' 1')
    const dateB = new Date(b.month + ' 1')
    return dateA.getTime() - dateB.getTime()
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No trend data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Income vs Expenses Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Income"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              stroke="#EF4444" 
              strokeWidth={2}
              name="Expenses"
              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="net" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Net"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-lg font-semibold text-green-600">
            ${chartData.reduce((sum, item) => sum + item.income, 0).toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-lg font-semibold text-red-600">
            ${chartData.reduce((sum, item) => sum + item.expense, 0).toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Net Total</p>
          <p className={`text-lg font-semibold ${
            chartData.reduce((sum, item) => sum + item.net, 0) >= 0 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            ${chartData.reduce((sum, item) => sum + item.net, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
