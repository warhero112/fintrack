import React from 'react'
import { TopBar } from '../components/layout/TopBar'

export const StatsScreen: React.FC = () => {
  return (
    <div className="pb-28">
      <TopBar title="Statistics" />
      <div className="px-4 space-y-4 max-w-md mx-auto">
        <div className="rounded-2xl shadow-sm border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Statistics Coming Soon
          </h2>
          <p className="text-muted-foreground">
            Advanced analytics and insights will be available here.
          </p>
        </div>
      </div>
    </div>
  )
}
