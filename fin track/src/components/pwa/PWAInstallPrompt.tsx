import React from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { usePWA } from '../../hooks/usePWA'

export const PWAInstallPrompt: React.FC = () => {
  const { canInstall, installApp, isInstalled } = usePWA()

  if (isInstalled || !canInstall) return null

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      // Show success message or redirect
    }
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 bg-primary text-primary-foreground border-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            <CardTitle className="text-sm">Install FinTrack</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => {/* Dismiss logic */}}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-primary-foreground/80 mb-3">
          Install FinTrack for quick access and offline functionality
        </p>
        <Button
          onClick={handleInstall}
          size="sm"
          className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Install App
        </Button>
      </CardContent>
    </Card>
  )
}
