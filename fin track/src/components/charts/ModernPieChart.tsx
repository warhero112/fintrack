import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface CategoryData {
  category: string
  amount: number
  percentage: number
  color: string
}

interface ModernPieChartProps {
  data: CategoryData[]
  title?: string
  height?: number
}

const COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
        <p className="font-semibold text-slate-900">{data.category}</p>
        <p className="text-slate-600">
          Amount: <span className="font-medium">${data.amount.toLocaleString()}</span>
        </p>
        <p className="text-slate-600">
          Percentage: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
        </p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-slate-600">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export const ModernPieChart: React.FC<ModernPieChartProps> = ({ 
  data, 
  title = "Spending by Category",
  height = 300 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-500">No spending data available</p>
        </div>
      </div>
    )
  }

  const chartData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }))

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="amount"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">
              ${data.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">Total Spent</div>
          </div>
        </div>
      </div>
      
      <CustomLegend payload={chartData.map(item => ({ value: item.category, color: item.color }))} />
    </div>
  )
}