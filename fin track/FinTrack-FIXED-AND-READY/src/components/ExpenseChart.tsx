import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpenseChartProps {
  data: any[];
  type: 'pie' | 'bar';
  title: string;
}

const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#6b7280', '#ec4899', '#14b8a6'];

export function ExpenseChart({ data, type, title }: ExpenseChartProps) {
  if (type === 'pie') {
    const pieData = data.map((item, index) => ({
      name: item.name,
      value: item.spent || item.balance || item.amount,
      color: item.color || COLORS[index % COLORS.length]
    })).filter(item => item.value > 0);

    return (
      <div className="w-full h-64">
        <h3 className="text-center mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <h3 className="text-center mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
          <Bar dataKey="balance" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}