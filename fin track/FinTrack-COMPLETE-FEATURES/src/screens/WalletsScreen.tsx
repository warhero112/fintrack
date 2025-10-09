import React from 'react'
import { TopBar } from '../components/layout/TopBar'

export const WalletsScreen: React.FC = () => {
  return (
    <div className="pb-28">
      <TopBar title="Wallets" />
      <div className="px-4 space-y-4 max-w-md mx-auto">
        <div className="rounded-2xl shadow-sm border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Wallet Management
          </h2>
          <p className="text-muted-foreground">
            Manage your accounts and wallets here.
          </p>
        </div>
      </div>
    </div>
  )
}
