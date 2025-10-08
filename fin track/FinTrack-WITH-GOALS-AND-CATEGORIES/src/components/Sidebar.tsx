import React, { useState } from 'react'
import { X, Settings, User, Wallet, PieChart, Moon, Sun, Monitor, Globe, DollarSign, LogIn, LogOut, Mail, Lock } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  settings: any
  onSettingsChange: (settings: any) => void
  isAuthenticated?: boolean
  onLogin?: () => void
  onLogout?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange, 
  isAuthenticated = false,
  onLogin,
  onLogout 
}) => {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')

    try {
      // Simulate login - replace with actual auth logic
      if (email && password) {
        // For now, just close the form and call onLogin
        setShowLoginForm(false)
        onLogin?.()
        setEmail('')
        setPassword('')
      } else {
        setLoginError('Please enter both email and password')
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    onLogout?.()
    onClose()
  }

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
          {/* Authentication Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User size={16} />
              Account
            </h3>
            
            {!isAuthenticated ? (
              <div className="space-y-3">
                {!showLoginForm ? (
                  <button
                    onClick={() => setShowLoginForm(true)}
                    className="w-full flex items-center gap-2 p-3 rounded-xl border border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <LogIn size={16} />
                    <span>Login with Email</span>
                  </button>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-3 p-3 border rounded-xl bg-muted/50">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border rounded-lg bg-input-background"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2 border rounded-lg bg-input-background"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    {loginError && (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {loginError}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="flex-1 bg-primary text-primary-foreground py-2 px-3 rounded-lg font-medium disabled:opacity-50"
                      >
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLoginForm(false)}
                        className="px-3 py-2 text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <User size={16} />
                    <span className="font-medium">Logged in as: {settings.name || 'User'}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 p-3 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Settings size={16} />
              Profile Settings
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
