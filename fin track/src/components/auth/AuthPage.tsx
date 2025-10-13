import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { Wallet, TrendingUp, Shield, Smartphone } from 'lucide-react'

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Left side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white">
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">FinTrack</h1>
            <p className="text-xl text-blue-100">
              Your personal finance management companion
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Multi-Account Management</h3>
                <p className="text-blue-100 text-sm">Track all your accounts in one place</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Smart Analytics</h3>
                <p className="text-blue-100 text-sm">Visual insights into your spending patterns</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-blue-100 text-sm">Your data is encrypted and secure</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Mobile Ready</h3>
                <p className="text-blue-100 text-sm">Access your finances anywhere, anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
