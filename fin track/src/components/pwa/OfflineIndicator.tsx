import React from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { usePWA } from '../../hooks/usePWA'

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA()

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isOnline ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm font-medium">Offline</span>
      </div>
    </div>
  )
}
