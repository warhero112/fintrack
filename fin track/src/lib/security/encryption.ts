// Simple encryption utilities for sensitive data
// In production, use a proper encryption library like crypto-js

export class DataEncryption {
  private static readonly KEY = 'fintrack-secure-key-2024' // In production, generate this securely

  // Simple XOR encryption (for demo purposes)
  // In production, use AES encryption
  static encrypt(text: string): string {
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ this.KEY.charCodeAt(i % this.KEY.length)
      result += String.fromCharCode(charCode)
    }
    return btoa(result) // Base64 encode
  }

  static decrypt(encryptedText: string): string {
    try {
      const decoded = atob(encryptedText) // Base64 decode
      let result = ''
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ this.KEY.charCodeAt(i % this.KEY.length)
        result += String.fromCharCode(charCode)
      }
      return result
    } catch (error) {
      console.error('Decryption failed:', error)
      return ''
    }
  }

  // Hash sensitive data for comparison
  static hash(text: string): string {
    let hash = 0
    if (text.length === 0) return hash.toString()
    
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16)
  }

  // Sanitize user input
  static sanitize(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }

  // Validate sensitive data
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validateAmount(amount: string | number): boolean {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return !isNaN(num) && num >= 0 && num <= 999999999 // Reasonable upper limit
  }

  static validateDescription(description: string): boolean {
    return description.length >= 1 && description.length <= 200
  }
}

// Security utilities for local storage
export class SecureStorage {
  private static readonly PREFIX = 'fintrack_secure_'

  static setItem(key: string, value: any): void {
    try {
      const encryptedValue = DataEncryption.encrypt(JSON.stringify(value))
      localStorage.setItem(this.PREFIX + key, encryptedValue)
    } catch (error) {
      console.error('Failed to store secure data:', error)
    }
  }

  static getItem(key: string): any {
    try {
      const encryptedValue = localStorage.getItem(this.PREFIX + key)
      if (!encryptedValue) return null
      
      const decryptedValue = DataEncryption.decrypt(encryptedValue)
      return JSON.parse(decryptedValue)
    } catch (error) {
      console.error('Failed to retrieve secure data:', error)
      return null
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key)
  }

  static clear(): void {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }
}

// Data masking for sensitive information
export class DataMasking {
  static maskEmail(email: string): string {
    const [username, domain] = email.split('@')
    if (username.length <= 2) return email
    
    const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
    return `${maskedUsername}@${domain}`
  }

  static maskAmount(amount: number): string {
    if (amount < 100) return '$***'
    if (amount < 1000) return '$***'
    if (amount < 10000) return '$****'
    return '$*****'
  }

  static maskCardNumber(cardNumber: string): string {
    if (cardNumber.length < 8) return cardNumber
    return cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4)
  }
}

// Audit logging for security events
export class SecurityAudit {
  private static logs: Array<{
    timestamp: string
    event: string
    details: any
    severity: 'low' | 'medium' | 'high'
  }> = []

  static log(event: string, details: any, severity: 'low' | 'medium' | 'high' = 'low'): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      severity
    }
    
    this.logs.push(logEntry)
    
    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100)
    }
    
    // In production, send to security monitoring service
    if (severity === 'high') {
      console.warn('High severity security event:', logEntry)
    }
  }

  static getLogs(): typeof this.logs {
    return [...this.logs]
  }

  static clearLogs(): void {
    this.logs = []
  }
}
