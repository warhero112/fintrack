import React from 'react'
import { RefreshCw, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { usePWA } from '../../hooks/usePWA'

export const UpdatePrompt: React.FC = () => {
  const { needRefresh, updateApp, dismissUpdate } = usePWA()

  if (!needRefresh) return null

  return (
    <Card className="fixed top-4 left-4 right-4 z-50 bg-orange-500 text-white border-orange-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            <CardTitle className="text-sm">Update Available</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={dismissUpdate}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-white/80 mb-3">
          A new version of FinTrack is available. Update now for the latest features and improvements.
        </p>
        <div className="flex gap-2">
          <Button
            onClick={updateApp}
            size="sm"
            className="flex-1 bg-white text-orange-500 hover:bg-white/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Now
          </Button>
          <Button
            onClick={dismissUpdate}
            size="sm"
            variant="outline"
            className="border-white text-white hover:bg-white/20"
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
