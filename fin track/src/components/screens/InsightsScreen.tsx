import { TrendingUp, PieChart, BarChart3, Activity, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export function InsightsScreen() {
  const { transactions, budgets, getTotals, getCategoryTotals, getMonthlyTotals } = useAppStore();
  
  const totals = getTotals();
  const categoryTotals = getCategoryTotals();
  const currentDate = new Date();
  const monthlyTotals = getMonthlyTotals(currentDate.getFullYear(), currentDate.getMonth());

  const savingsRate = totals.income > 0 ? ((totals.income - totals.expenses) / totals.income * 100) : 0;
  
  const financialHealth = () => {
    let score = 50;
    if (savingsRate > 20) score += 30;
    else if (savingsRate > 10) score += 15;
    
    const overBudgetCount = budgets.filter(b => b.spent > b.limit).length;
    if (overBudgetCount === 0) score += 20;
    else score -= overBudgetCount * 5;

    if (totals.balance > 0) score += 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const healthScore = financialHealth();

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'emerald';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'rose';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const healthColor = getHealthColor(healthScore);

  const insights = [
    {
      icon: TrendingUp,
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      description: savingsRate >= 20 ? 'Great job!' : 'Try to save at least 20%',
      color: savingsRate >= 20 ? 'emerald' : 'orange'
    },
    {
      icon: Activity,
      title: 'Transaction Activity',
      value: transactions.length.toString(),
      description: 'Total transactions recorded',
      color: 'blue'
    },
    {
      icon: PieChart,
      title: 'Categories Tracked',
      value: categoryTotals.length.toString(),
      description: 'Different expense categories',
      color: 'purple'
    }
  ];

  const recommendations = [];
  if (savingsRate < 20) {
    recommendations.push({
      title: 'Increase Your Savings',
      description: 'You\'re currently saving ' + savingsRate.toFixed(1) + '% of your income. Aim for at least 20% to build financial security.',
      icon: AlertCircle,
      color: 'orange'
    });
  }

  const overBudget = budgets.filter(b => b.spent > b.limit);
  if (overBudget.length > 0) {
    recommendations.push({
      title: 'Budget Alert',
      description: `You're over budget in ${overBudget.length} ${overBudget.length === 1 ? 'category' : 'categories'}: ${overBudget.map(b => b.category).join(', ')}.`,
      icon: AlertCircle,
      color: 'rose'
    });
  }

  if (categoryTotals.length > 0) {
    const topCategory = categoryTotals[0];
    recommendations.push({
      title: 'Top Spending Category',
      description: `Your highest expense is ${topCategory.category} at $${topCategory.amount.toLocaleString()} (${topCategory.percentage.toFixed(0)}% of total expenses).`,
      icon: PieChart,
      color: 'slate'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Great Financial Health!',
      description: 'You\'re managing your finances well. Keep up the good work!',
      icon: TrendingUp,
      color: 'emerald'
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-800 p-8 text-white border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white">Financial Insights</h2>
            <p className="text-slate-300 text-sm">Advanced analytics and recommendations</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 border border-slate-200">
        <h3 className="text-slate-900 mb-6">Financial Health Score</h3>
        
        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-slate-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(healthScore / 100) * 351.86} 351.86`}
                strokeLinecap="round"
                className={`text-${healthColor}-500 transition-all duration-1000`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-${healthColor}-700`}>
                  {healthScore}
                </div>
                <p className="text-slate-600 text-xs">/ 100</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className={`text-${healthColor}-700 mb-2`}>
              {getHealthLabel(healthScore)}
            </h4>
            <p className="text-slate-600 text-sm mb-3">
              Your financial health is calculated based on savings rate, budget adherence, and overall balance.
            </p>
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full bg-${healthColor}-500 transition-all duration-1000`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="rounded-2xl bg-white p-6 border border-slate-200 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-${insight.color}-100 flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 text-${insight.color}-700`} />
              </div>
              <p className="text-slate-600 text-sm mb-1">{insight.title}</p>
              <h3 className={`text-${insight.color}-700 mb-2`}>
                {insight.value}
              </h3>
              <p className="text-slate-500 text-xs">{insight.description}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-8 border border-slate-200">
        <h3 className="text-slate-900 mb-6">Spending Breakdown</h3>
        
        {categoryTotals.length > 0 ? (
          <div className="space-y-4">
            {categoryTotals.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900">{category.category}</span>
                  <div className="text-right">
                    <span className="text-slate-900">${category.amount.toLocaleString()}</span>
                    <span className="text-slate-500 text-sm ml-2">({category.percentage.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-700 transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No expense data yet</p>
        )}
      </div>

      <div className="rounded-2xl bg-white p-8 border border-slate-200">
        <h3 className="text-slate-900 mb-6">Recommendations</h3>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div key={index} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className={`w-12 h-12 rounded-xl bg-${rec.color}-100 flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 text-${rec.color}-700`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-900 mb-1">{rec.title}</h4>
                  <p className="text-slate-600 text-sm">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-8 border border-slate-200">
        <h3 className="text-slate-900 mb-6">This Month Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <p className="text-emerald-700 text-sm mb-1">Income</p>
            <p className="text-emerald-900">${monthlyTotals.income.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <p className="text-rose-700 text-sm mb-1">Expenses</p>
            <p className="text-rose-900">${monthlyTotals.expenses.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
            <p className="text-slate-700 text-sm mb-1">Net</p>
            <p className="text-slate-900">${monthlyTotals.balance.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}