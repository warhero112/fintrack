import React from 'react'
import { X, Settings, User, Wallet, PieChart, Moon, Sun, Monitor, Globe, DollarSign } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  settings: any
  onSettingsChange: (settings: any) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ]

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: '₨' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'KRW', name: 'Korean Won', symbol: '₩' },
  ]

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-80 bg-background border-r border-border shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
          {/* User Profile */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User size={16} />
              Profile
            </h3>
            <div className="space-y-2">
              <label className="block text-sm text-muted-foreground">Name</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => onSettingsChange({ ...settings, name: e.target.value })}
                className="w-full border rounded-xl px-3 py-2 bg-input-background"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe size={16} />
              Language
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onSettingsChange({ ...settings, language: lang.name, locale: lang.code })}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    settings.language === lang.name
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="text-lg mb-1">{lang.flag}</div>
                  <div className="text-sm font-medium">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign size={16} />
              Currency
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => onSettingsChange({ ...settings, currency: currency.code })}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    settings.currency === currency.code
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <div className="text-lg mb-1">{currency.symbol}</div>
                  <div className="text-sm font-medium">{currency.name}</div>
                  <div className="text-xs text-muted-foreground">{currency.code}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Settings size={16} />
              Theme
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((theme) => {
                const Icon = theme.icon
                return (
                  <button
                    key={theme.value}
                    onClick={() => onSettingsChange({ ...settings, theme: theme.value })}
                    className={`p-3 rounded-xl border text-center transition-colors ${
                      settings.theme === theme.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <Icon size={20} className="mx-auto mb-2" />
                    <div className="text-sm font-medium">{theme.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Notifications</span>
                <input
                  type="checkbox"
                  checked={settings.notifications || false}
                  onChange={(e) => onSettingsChange({ ...settings, notifications: e.target.checked })}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Auto Sync</span>
                <input
                  type="checkbox"
                  checked={settings.autoSync || false}
                  onChange={(e) => onSettingsChange({ ...settings, autoSync: e.target.checked })}
                  className="rounded"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
