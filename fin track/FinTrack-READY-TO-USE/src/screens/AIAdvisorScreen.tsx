import React from 'react'
import { TopBar } from '../components/layout/TopBar'
import { AIFinancialAdvisor } from '../components/ai/AIFinancialAdvisor'
import { useAppStore } from '../stores/appStore'

export const AIAdvisorScreen: React.FC = () => {
  const { transactions, accounts, budgets } = useAppStore()
  
  const financialData = {
    transactions: transactions.map(t => ({
      id: t.id,
      amount: t.amount,
      category: t.category,
      type: t.type,
      date: t.date,
      description: t.label
    })),
    accounts: accounts.map(a => ({
      id: a.id,
      name: a.name,
      balance: a.balance,
      currency: a.currency
    })),
    budgets: budgets.map(b => ({
      category: b.category,
      limit: b.limit,
      spent: b.spent
    })),
    totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    netWorth: accounts.reduce((sum, a) => sum + a.balance, 0) + 
              transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - 
              transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  }

  return (
    <div className="pb-28">
      <TopBar title="AI Financial Advisor" />
      <div className="px-4 max-w-4xl mx-auto">
        <AIFinancialAdvisor financialData={financialData} />
      </div>
    </div>
  )
}
