type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: string
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private logs: LogEntry[] = []

  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    // Store log entry
    this.logs.push(entry)

    // Keep only last 100 logs to prevent memory issues
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100)
    }

    // Only log to console in development
    if (this.isDevelopment) {
      const logMethod = console[level] || console.log
      if (data) {
        logMethod(`[${level.toUpperCase()}] ${message}`, data)
      } else {
        logMethod(`[${level.toUpperCase()}] ${message}`)
      }
    }

    // In production, you could send logs to a service
    if (!this.isDevelopment && level === 'error') {
      // Send to error tracking service (e.g., Sentry)
      this.sendToErrorService(entry)
    }
  }

  private sendToErrorService(entry: LogEntry): void {
    // Implement error tracking service integration
    // For now, we'll just store it locally
    try {
      const errorLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]')
      errorLogs.push(entry)
      localStorage.setItem('errorLogs', JSON.stringify(errorLogs.slice(-50))) // Keep last 50 errors
    } catch (e) {
      // Silently fail if localStorage is not available
    }
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data)
  }

  info(message: string, data?: any): void {
    this.log('info', message, data)
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data)
  }

  error(message: string, data?: any): void {
    this.log('error', message, data)
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

export const logger = new Logger()
export default logger
