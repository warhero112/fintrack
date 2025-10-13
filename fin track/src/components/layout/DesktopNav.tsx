import React from 'react'
import { 
  Home, 
  BarChart3, 
  Calendar, 
  List, 
  Settings, 
  Brain, 
  Trophy, 
  Plus, 
  Wallet,
  Tags,
  Target,
  Download,
  Upload,
  HelpCircle
} from 'lucide-react'
import { useAppStore } from '../../stores/appStore'
import { logger } from '../../lib/logger'

interface DesktopNavProps {
  isMobileView: boolean
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ isMobileView }) => {
  const { 
    tab, 
    setTab, 
    setShowAdd, 
    exportToCSV, 
    exportToJSON 
  } = useAppStore()

  const handleExport = () => {
    try {
      const csvData = exportToCSV()
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fintrack-transactions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      logger.info('Data exported to CSV successfully')
    } catch (error) {
      logger.error('Error exporting data to CSV', error)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          if (file.name.endsWith('.csv')) {
            logger.info('CSV file selected for import', { fileName: file.name, size: file.size })
            // Handle CSV import logic here
          } else if (file.name.endsWith('.json')) {
            logger.info('JSON file selected for import', { fileName: file.name, size: file.size })
            // Handle JSON import logic here
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleCategories = () => {
    logger.info('Categories menu clicked')
    // Add categories functionality here
  }

  const handleBudgets = () => {
    logger.info('Budgets menu clicked')
    // Add budgets functionality here
  }

  const handleHelp = () => {
    logger.info('Help menu clicked')
    // Add help functionality here
  }

  if (isMobileView) return null

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
      <div className="p-4">
        {/* App Branding */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <Wallet className="text-primary-foreground" size={24} />
          </div>
          <h2 className="text-xl font-bold text-foreground">FinTrack</h2>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1">
          {[
            { icon: <Home size={20} />, label: "Home", index: 0 },
            { icon: <BarChart3 size={20} />, label: "Insights", index: 1 },
            { icon: <Calendar size={20} />, label: "Calendar", index: 2 },
            { icon: <List size={20} />, label: "Transactions", index: 3 },
            { icon: <Settings size={20} />, label: "Settings", index: 4 },
            { icon: <Brain size={20} />, label: "AI Advisor", index: 5 },
            { icon: <Trophy size={20} />, label: "Goals", index: 6 },
          ].map((item) => (
            <button
              key={item.index}
              onClick={() => setTab(item.index)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                tab === item.index 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          {/* Quick Add Button */}
          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition bg-primary text-primary-foreground hover:opacity-90 mt-2"
          >
            <Plus size={20} />
            <span className="font-medium">Add Transaction</span>
          </button>

          {/* Utility Actions Section */}
          <div className="pt-4 mt-4 border-t border-border space-y-1">
            {[
              { icon: <Tags size={20} />, label: "Categories", action: handleCategories },
              { icon: <Target size={20} />, label: "Budgets", action: handleBudgets },
              { icon: <Download size={20} />, label: "Export", action: handleExport },
              { icon: <Upload size={20} />, label: "Import", action: handleImport },
              { icon: <HelpCircle size={20} />, label: "Help", action: handleHelp },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl transition text-foreground hover:bg-muted"
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}
