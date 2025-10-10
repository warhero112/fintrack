// Settings-related type definitions
export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  currency: string
  language: string
  notifications: boolean
  autoSync: boolean
  dateFormat: string
  timeFormat: '12h' | '24h'
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  accentColor: string
}

export interface NotificationSettings {
  budgetAlerts: boolean
  goalReminders: boolean
  weeklyReports: boolean
  transactionAlerts: boolean
}
