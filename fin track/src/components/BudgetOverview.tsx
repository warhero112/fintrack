import { AlertCircle, TrendingUp } from 'lucide-react';
import { Budget } from '../store/appStore';

interface BudgetOverviewProps {
  budgets: Budget[];
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-rose-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="rounded-2xl bg-white p-8 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3>Budget Overview</h3>
        </div>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const remaining = budget.limit - budget.spent;
          const isOverBudget = percentage >= 100;
          const isNearLimit = percentage >= 90 && percentage < 100;

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900">{budget.category}</span>
                  {(isOverBudget || isNearLimit) && (
                    <AlertCircle className={`w-4 h-4 ${isOverBudget ? 'text-rose-500' : 'text-orange-500'}`} />
                  )}
                </div>
                <div className="text-sm">
                  <span className="text-slate-900">{formatCurrency(budget.spent)}</span>
                  <span className="text-slate-500"> / {formatCurrency(budget.limit)}</span>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className={`${isOverBudget ? 'text-rose-600' : 'text-slate-500'}`}>
                  {percentage.toFixed(0)}% used
                </span>
                <span className={`${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {isOverBudget ? 'Over by ' : ''}{formatCurrency(Math.abs(remaining))} {isOverBudget ? '' : 'left'}
                </span>
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">No budgets set yet</p>
          </div>
        )}
      </div>
    </div>
  );
}