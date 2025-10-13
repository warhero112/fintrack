import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface BalanceCardsProps {
  balance: number;
  income: number;
  expenses: number;
  currency?: string;
}

export function BalanceCards({ balance, income, expenses, currency = 'USD' }: BalanceCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const cards = [
    {
      title: 'Net Worth',
      amount: balance,
      color: 'slate',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      icon: TrendingUp,
      change: '+12.5%',
      changeColor: 'text-emerald-600'
    },
    {
      title: 'Total Income',
      amount: income,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: ArrowUpRight,
      change: '+8.2%',
      changeColor: 'text-emerald-600'
    },
    {
      title: 'Total Expenses',
      amount: expenses,
      color: 'rose',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      icon: ArrowDownRight,
      change: '-3.1%',
      changeColor: 'text-rose-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const iconBgClass = {
          slate: 'bg-slate-800',
          emerald: 'bg-emerald-600',
          rose: 'bg-rose-600'
        }[card.color];
        
        const textColorClass = {
          slate: 'text-slate-700',
          emerald: 'text-emerald-700',
          rose: 'text-rose-700'
        }[card.color];

        return (
          <div
            key={index}
            className={`rounded-2xl ${card.bgColor} p-6 border ${card.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600 text-sm font-medium">{card.title}</p>
              <div className={`w-12 h-12 rounded-xl ${iconBgClass} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mb-3">
              <h2 className={`text-2xl font-bold ${textColorClass}`}>
                {formatCurrency(card.amount)}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${card.changeColor}`}>
                {card.change}
              </span>
              <span className="text-slate-500 text-xs">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}