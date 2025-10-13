import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface CalendarScreenProps {
  isMobileView: boolean
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ isMobileView }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { transactions, setShowAdd } = useAppStore()

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getTransactionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return transactions.filter(t => t.date === dateStr)
  }

  const getTotalForDate = (date: Date) => {
    const dayTransactions = getTransactionsForDate(date)
    const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    return { income, expense, net: income - expense }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-200"></div>
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const totals = getTotalForDate(date)
      const dayTransactions = getTransactionsForDate(date)
      
      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
            isToday(date) ? 'bg-blue-50 border-blue-200' : ''
          } ${!isCurrentMonth(date) ? 'text-gray-400' : ''}`}
          onClick={() => setShowAdd(true)}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
              {day}
            </span>
            {dayTransactions.length > 0 && (
              <span className="text-xs text-gray-500">{dayTransactions.length}</span>
            )}
          </div>
          
          {totals.income > 0 && (
            <div className="text-xs text-green-600 font-medium">
              +${totals.income.toFixed(0)}
            </div>
          )}
          
          {totals.expense > 0 && (
            <div className="text-xs text-red-600 font-medium">
              -${totals.expense.toFixed(0)}
            </div>
          )}
          
          {totals.net !== 0 && (
            <div className={`text-xs font-medium ${
              totals.net > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {totals.net > 0 ? '+' : ''}${totals.net.toFixed(0)}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const getMonthSummary = () => {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year
    })
    
    const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    
    return { income, expense, net: income - expense, count: monthTransactions.length }
  }

  const monthSummary = getMonthSummary()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600">Track your transactions by date</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>

        {/* Month Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${monthSummary.income.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Income</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">${monthSummary.expense.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Expenses</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${monthSummary.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${monthSummary.net.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Net</div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </div>
      </div>
    </div>
  )
}
