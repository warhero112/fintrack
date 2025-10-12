import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/appStore';

export function CalendarScreen() {
  const { transactions, setShowAdd, getMonthlyTotals } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthlyTotals = getMonthlyTotals(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTransactionsForDay = (day: number) => {
    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const getDayTotal = (day: number) => {
    const dayTransactions = getTransactionsForDay(day);
    const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, net: income - expenses };
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-800 p-8 text-white border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white">Calendar</h2>
              <p className="text-slate-300 text-sm">Track your daily transactions</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition-all text-white"
          >
            <Plus className="w-5 h-5 inline mr-1" />
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-emerald-700 text-sm mb-1">Income</p>
          <p className="text-emerald-900">${monthlyTotals.income.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
          <p className="text-rose-700 text-sm mb-1">Expenses</p>
          <p className="text-rose-900">${monthlyTotals.expenses.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 border border-slate-200 p-4">
          <p className="text-slate-700 text-sm mb-1">Net</p>
          <p className="text-slate-900">${monthlyTotals.balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          
          <div className="text-center">
            <h3 className="text-slate-900">{monthNames[month]} {year}</h3>
            <button
              onClick={goToToday}
              className="text-sm text-slate-700 hover:text-slate-900 transition-colors"
            >
              Today
            </button>
          </div>

          <button
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-slate-600 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dayTotals = getDayTotal(day);
            const hasTransactions = dayTotals.income > 0 || dayTotals.expenses > 0;
            const today = isToday(day);

            return (
              <button
                key={day}
                onClick={() => setShowAdd(true)}
                className={`aspect-square rounded-xl p-2 transition-all hover:shadow-md ${
                  today
                    ? 'bg-slate-800 text-white'
                    : hasTransactions
                    ? 'bg-slate-100'
                    : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm ${today ? 'text-white' : 'text-slate-900'}`}>
                    {day}
                  </span>
                  {hasTransactions && (
                    <div className="flex-1 flex flex-col justify-end gap-0.5 mt-1">
                      {dayTotals.income > 0 && (
                        <div className={`h-1 rounded-full ${today ? 'bg-emerald-300' : 'bg-emerald-500'}`} />
                      )}
                      {dayTotals.expenses > 0 && (
                        <div className={`h-1 rounded-full ${today ? 'bg-rose-300' : 'bg-rose-500'}`} />
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600 text-sm">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-600 text-sm">Expense</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-800" />
            <span className="text-slate-600 text-sm">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}