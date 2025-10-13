import { useEffect, useState } from 'react'
import { logger } from '../lib/logger'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  isSlowConnection: boolean
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    isSlowConnection: false
  })

  useEffect(() => {
    // Measure page load time
    const measureLoadTime = () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
        setMetrics(prev => ({ ...prev, loadTime }))
        logger.info('Page load time measured', { loadTime })
      }
    }

    // Measure memory usage
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
        setMetrics(prev => ({ ...prev, memoryUsage }))
      }
    }

    // Check connection speed
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                                connection.effectiveType === '2g' ||
                                connection.downlink < 1
        setMetrics(prev => ({ ...prev, isSlowConnection }))
      }
    }

    // Measure component render time
    const measureRenderTime = (componentName: string) => {
      const start = performance.now()
      return () => {
        const end = performance.now()
        const renderTime = end - start
        setMetrics(prev => ({ ...prev, renderTime }))
        logger.debug(`Component ${componentName} render time`, { renderTime })
      }
    }

    // Initial measurements
    measureLoadTime()
    measureMemory()
    checkConnection()

    // Set up periodic memory checks
    const memoryInterval = setInterval(measureMemory, 30000) // Every 30 seconds

    return () => {
      clearInterval(memoryInterval)
    }
  }, [])

  // Performance optimization suggestions
  const getOptimizationSuggestions = (): string[] => {
    const suggestions: string[] = []

    if (metrics.loadTime > 3000) {
      suggestions.push('Consider enabling code splitting to reduce initial load time')
    }

    if (metrics.memoryUsage > 0.8) {
      suggestions.push('High memory usage detected. Consider optimizing data structures')
    }

    if (metrics.isSlowConnection) {
      suggestions.push('Slow connection detected. Consider reducing image sizes and enabling compression')
    }

    if (metrics.renderTime > 16) {
      suggestions.push('Slow render time detected. Consider optimizing component rendering')
    }

    return suggestions
  }

  return {
    metrics,
    getOptimizationSuggestions,
    isSlowConnection: metrics.isSlowConnection
  }
}
