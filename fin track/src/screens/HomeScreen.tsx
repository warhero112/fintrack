import React from 'react'
import { BalanceCards } from '../components/home/BalanceCards'
import { RecentTransactions } from '../components/home/RecentTransactions'
import { CategoryChart } from '../components/analytics/CategoryChart'
import { TrendsChart } from '../components/analytics/TrendsChart'
import { BudgetTracker } from '../components/BudgetTracker'
import { Plus, TrendingUp, DollarSign, Calendar, Target, Wallet, CreditCard, PieChart } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

interface HomeScreenProps {
  isMobileView: boolean
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ isMobileView }) => {
  const { setShowAdd, getMonthlyTotals, getCategoryTotals } = useAppStore()
  
  const monthlyTotals = getMonthlyTotals()
  const categoryTotals = getCategoryTotals()

  // Convert categoryTotals object to array for display
  const categoryTotalsArray = Object.entries(categoryTotals).map(([category, data]) => ({
    category,
    amount: data.expense, // Use expense for spending display
    percentage: 0 // Will be calculated below
  }))

  // Calculate percentages
  const totalExpenses = categoryTotalsArray.reduce((sum, cat) => sum + cat.amount, 0)
  const categoryTotalsWithPercentages = categoryTotalsArray.map(cat => ({
    ...cat,
    percentage: totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0
  })).sort((a, b) => b.amount - a.amount)

  const quickActions = [
    {
      title: 'Add Transaction',
      icon: Plus,
      color: 'bg-slate-800',
      onClick: () => setShowAdd(true)
    },
    {
      title: 'View Calendar',
      icon: Calendar,
      color: 'bg-slate-800',
      onClick: () => {}
    },
    {
      title: 'Set Goals',
      icon: Target,
      color: 'bg-slate-800',
      onClick: () => {}
    },
    {
      title: 'View Insights',
      icon: TrendingUp,
      color: 'bg-slate-800',
      onClick: () => {}
    }
  ]

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center bg-white p-4 pb-2 justify-between">
        <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">Overview</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-[#111418] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
            <div className="text-[#111418]" data-icon="Gear" data-size="24px" data-weight="regular">
              <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* This Month Section */}
      <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">This Month</h2>
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 bg-[#f0f2f4]">
          <p className="text-[#111418] text-base font-medium leading-normal">Spending</p>
          <p className="text-[#111418] tracking-light text-2xl font-bold leading-tight">${monthlyTotals.expense.toLocaleString()}</p>
        </div>
      </div>

      {/* Budget Section */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between">
          <p className="text-[#111418] text-base font-medium leading-normal">Budget</p>
          <p className="text-[#111418] text-sm font-normal leading-normal">1500</p>
        </div>
        <div className="rounded bg-[#dbe0e6]">
          <div className="h-2 rounded bg-[#111418]" style={{width: '60%'}}></div>
        </div>
      </div>

      {/* Balance Cards */}
      <BalanceCards />

      {/* Quick Insights */}
      <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Quick Insights</h2>
      <div className="p-4">
        <div className="bg-cover bg-center flex flex-col items-stretch justify-end rounded-xl pt-[132px]" style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvW-X3I95tRwZUVcdQMfAjYP9B2BYRyg6gdCTHown6vglcaboEzzNPaUVCKcsJgGbwYC9ZOHORq5y8BFvN4l6QpKId15_BQvN1TfirJv1m5eOeHAe84rIbhPwHF8ivl4vC782yn7IB6H2jNITdxHLDWnAHtKR7W0AZNnTGTNdrvAtd9hKUOMqjFsz-M")'}}>
          <div className="flex w-full items-end justify-between gap-4 p-4">
            <div className="flex max-w-[440px] flex-1 flex-col gap-1">
              <p className="text-white tracking-light text-2xl font-bold leading-tight max-w-[440px]">You're spending more on dining out this month</p>
              <p className="text-white text-base font-medium leading-normal">Compared to last month, your dining out expenses have increased by 15%.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Monthly Overview</h2>
      <div className="flex flex-wrap gap-4 px-4 py-6">
        <div className="flex min-w-72 flex-1 flex-col gap-2">
          <p className="text-[#111418] text-base font-medium leading-normal">Spending by Category</p>
          <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
            <div className="border-[#617589] bg-[#f0f2f4] border-t-2 w-full" style={{height: '90%'}}></div>
            <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">Food</p>
            <div className="border-[#617589] bg-[#f0f2f4] border-t-2 w-full" style={{height: '90%'}}></div>
            <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">Transport</p>
            <div className="border-[#617589] bg-[#f0f2f4] border-t-2 w-full" style={{height: '30%'}}></div>
            <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">Entertainment</p>
            <div className="border-[#617589] bg-[#f0f2f4] border-t-2 w-full" style={{height: '70%'}}></div>
            <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">Utilities</p>
            <div className="border-[#617589] bg-[#f0f2f4] border-t-2 w-full" style={{height: '70%'}}></div>
            <p className="text-[#617589] text-[13px] font-bold leading-normal tracking-[0.015em]">Utilities</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Transactions</h2>
      <RecentTransactions />

      {/* Add Transaction Button */}
      <div className="sticky bottom-0 w-full bg-white pb-3 pt-2">
        <div className="px-4">
          <button 
            className="flex h-12 w-full flex-col items-center justify-center rounded-xl bg-[#111418] text-white"
            onClick={() => setShowAdd(true)}
          >
            <p className="text-base font-bold leading-normal tracking-[0.015em]">Add Transaction</p>
          </button>
        </div>
      </div>
    </div>
  )
}
