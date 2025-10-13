import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function FinTrackCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: ''
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleMonthChange = (month) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
  };

  const handleYearChange = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.description) {
      alert('Please fill in amount and description');
      return;
    }

    const dateKey = formatDate(selectedDate);
    const newTransaction = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now()
    };

    setTransactions(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTransaction]
    }));

    setFormData({ type: 'expense', amount: '', description: '', category: '' });
    setShowModal(false);
  };

  const getDayTransactions = (day) => {
    const dateKey = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    return transactions[dateKey] || [];
  };

  const calculateDayStats = (day) => {
    const dayTransactions = getDayTransactions(day);
    const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const net = income - expense;
    
    return { income, expense, net, count: dayTransactions.length };
  };

  const getMonthStats = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    
    Object.keys(transactions).forEach(dateKey => {
      const date = new Date(dateKey);
      if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
        transactions[dateKey].forEach(t => {
          if (t.type === 'income') totalIncome += t.amount;
          else totalExpense += t.amount;
        });
      }
    });
    
    return { totalIncome, totalExpense, net: totalIncome - totalExpense };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const monthStats = getMonthStats();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year range (current year ± 50 years)
  const years = Array.from({ length: 101 }, (_, i) => today.getFullYear() - 50 + i);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-light text-foreground mb-2">
            FinTrack Calendar
          </h1>
          <div className="h-px bg-border" />
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Income</div>
            <div className="text-xl font-light text-foreground">${monthStats.totalIncome.toFixed(2)}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Expenses</div>
            <div className="text-xl font-light text-foreground">${monthStats.totalExpense.toFixed(2)}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Net</div>
            <div className={`text-xl font-light ${monthStats.net >= 0 ? 'text-foreground' : 'text-foreground'}`}>
              {monthStats.net >= 0 ? '+' : ''}${monthStats.net.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-3">
            {/* Month Selector */}
            <select
              value={currentMonth}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              className="px-4 py-2 border border-border rounded text-foreground font-light bg-background hover:bg-muted focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {months.map((month, idx) => (
                <option key={month} value={idx}>
                  {month}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={currentYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="px-4 py-2 border border-border rounded text-foreground font-light bg-background hover:bg-muted focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 md:gap-3 mb-3">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground uppercase tracking-wider py-2">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {/* Empty cells */}
            {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const stats = calculateDayStats(day);
              const hasTransactions = stats.count > 0;
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square relative transition-all rounded ${
                    isToday(day)
                      ? 'bg-primary text-primary-foreground'
                      : hasTransactions
                      ? 'bg-muted hover:bg-muted/80 border border-border'
                      : 'hover:bg-muted border border-transparent hover:border-border'
                  }`}
                >
                  <div className="absolute inset-0 p-2 md:p-3 flex flex-col">
                    {/* Day number */}
                    <div className={`text-sm md:text-base font-light mb-auto text-left ${
                      isToday(day) ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                      {day}
                    </div>

                    {/* Transaction indicators */}
                    {hasTransactions && (
                      <div className="space-y-1">
                        {/* Dot indicators */}
                        <div className="flex items-center gap-1">
                          {stats.income > 0 && (
                            <div className={`w-1.5 h-1.5 rounded-full ${isToday(day) ? 'bg-primary-foreground' : 'bg-green-600'}`} />
                          )}
                          {stats.expense > 0 && (
                            <div className={`w-1.5 h-1.5 rounded-full ${isToday(day) ? 'bg-primary-foreground' : 'bg-red-600'}`} />
                          )}
                        </div>

                        {/* Net amount */}
                        <div className={`text-xs font-light ${
                          isToday(day)
                            ? 'text-primary-foreground'
                            : stats.net >= 0
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}>
                          {stats.net >= 0 ? '+' : ''}{Math.abs(stats.net).toFixed(0)}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-light text-foreground">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-muted rounded transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Existing Transactions */}
              {selectedDate && getDayTransactions(selectedDate.getDate()).length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                    Transactions
                  </h4>
                  <div className="space-y-2">
                    {getDayTransactions(selectedDate.getDate()).map((t) => (
                      <div
                        key={t.id}
                        className="p-4 border border-border rounded"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-light text-foreground mb-1 truncate">
                              {t.description}
                            </div>
                            {t.category && (
                              <div className="text-xs text-muted-foreground">
                                {t.category}
                              </div>
                            )}
                          </div>
                          <div className={`font-light whitespace-nowrap ${
                            t.type === 'income' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Transaction */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
                  Add Transaction
                </h4>

                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`py-3 px-4 rounded border transition-colors font-light ${
                      formData.type === 'expense'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`py-3 px-4 rounded border transition-colors font-light ${
                      formData.type === 'income'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    Income
                  </button>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded font-light focus:outline-none focus:border-primary transition-colors bg-background"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded font-light focus:outline-none focus:border-primary transition-colors bg-background"
                    placeholder="What was this for?"
                  />
                </div>

                {/* Category Input */}
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Category <span className="font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded font-light focus:outline-none focus:border-primary transition-colors bg-background"
                    placeholder="Food, Transport, Salary..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-primary text-primary-foreground py-3 rounded font-light hover:bg-primary/90 transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
