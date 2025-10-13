import { useState, useEffect } from 'react'

export const useViewMode = () => {
  const [viewMode, setViewMode] = useState<'auto' | 'mobile' | 'desktop'>('auto')
  const [isMobileView, setIsMobileView] = useState(false)

  // Automatic Detection
  useEffect(() => {
    const handleResize = () => {
      if (viewMode === 'auto') {
        setIsMobileView(window.innerWidth < 1024)
      } else if (viewMode === 'mobile') {
        setIsMobileView(true)
      } else {
        setIsMobileView(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [viewMode])

  return {
    viewMode,
    setViewMode,
    isMobileView,
    setIsMobileView
  }
}
