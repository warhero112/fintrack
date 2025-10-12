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
      color: 'slate-700',
      bgColor: 'bg-slate-100',
      icon: TrendingUp,
      change: '+12.5%'
    },
    {
      title: 'Total Income',
      amount: income,
      color: 'emerald-700',
      bgColor: 'bg-emerald-50',
      icon: ArrowUpRight,
      change: '+8.2%'
    },
    {
      title: 'Total Expenses',
      amount: expenses,
      color: 'rose-700',
      bgColor: 'bg-rose-50',
      icon: ArrowDownRight,
      change: '-3.1%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`rounded-2xl ${card.bgColor} p-6 border border-slate-200 hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-600 text-sm">{card.title}</p>
              <div className={`w-10 h-10 rounded-xl bg-${card.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="mb-2">
              <h2 className={`text-${card.color}`}>
                {formatCurrency(card.amount)}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${card.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
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