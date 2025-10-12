import { List, Search, Download, Upload, Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { RecentTransactions } from '../RecentTransactions';

export function TransactionsScreen() {
  const { transactions, setShowAdd } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'].join(','),
      ...transactions.map(t => [
        t.date,
        t.description,
        t.category,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-800 p-8 text-white border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center">
              <List className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white">All Transactions</h2>
              <p className="text-slate-300 text-sm">Manage and track all your transactions</p>
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
        <div className="rounded-2xl bg-white p-4 border border-slate-200">
          <p className="text-slate-600 text-sm mb-1">Total Transactions</p>
          <p className="text-slate-900">{filteredTransactions.length}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-emerald-700 text-sm mb-1">Total Income</p>
          <p className="text-emerald-900">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
          <p className="text-rose-700 text-sm mb-1">Total Expenses</p>
          <p className="text-rose-900">${totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-700" />
          <h3 className="text-slate-900">Filters & Search</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="flex-1 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5 text-slate-700" />
          <span className="text-slate-900">Export CSV</span>
        </button>
        <button className="flex-1 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-all flex items-center justify-center gap-2">
          <Upload className="w-5 h-5 text-slate-700" />
          <span className="text-slate-900">Import Data</span>
        </button>
      </div>

      {filteredTransactions.length > 0 ? (
        <RecentTransactions transactions={filteredTransactions} limit={filteredTransactions.length} />
      ) : (
        <div className="rounded-2xl bg-white p-12 border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-slate-900 mb-2">No transactions found</h3>
          <p className="text-slate-600">Try adjusting your filters or add a new transaction</p>
        </div>
      )}
    </div>
  );
}