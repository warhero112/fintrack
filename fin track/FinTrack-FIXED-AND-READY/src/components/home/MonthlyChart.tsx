import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface MonthlyChartProps {
  data: Array<{ day: string; income: number; expense: number }>
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  return (
    <div className="rounded-2xl shadow-sm border border-border bg-card p-4">
      <div className="text-sm text-muted-foreground mb-2">This Month</div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#22C55E" 
              strokeWidth={2} 
              dot={false} 
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              stroke="#EF4444" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
