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
      color: 'blue',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      icon: TrendingUp,
      change: '+12.5%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Income',
      amount: income,
      color: 'green',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      borderColor: 'border-green-200',
      icon: ArrowUpRight,
      change: '+8.2%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      amount: expenses,
      color: 'red',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-100',
      borderColor: 'border-red-200',
      icon: ArrowDownRight,
      change: '-3.1%',
      changeColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const iconBgClass = {
          blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
          green: 'bg-gradient-to-br from-green-500 to-emerald-600',
          red: 'bg-gradient-to-br from-red-500 to-rose-600'
        }[card.color];
        
        const textColorClass = {
          blue: 'text-blue-700',
          green: 'text-green-700',
          red: 'text-red-700'
        }[card.color];

        return (
          <div
            key={index}
            className={`rounded-2xl ${card.bgColor} p-6 border ${card.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm font-medium">{card.title}</p>
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
              <span className="text-gray-500 text-xs">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}