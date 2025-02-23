import type { AppError } from '../../types/error'

interface ErrorLoggerOptions {
  shouldIncludeStack?: boolean
  environment?: 'development' | 'production'
  version?: string
}

class ErrorLogger {
  private options: ErrorLoggerOptions

  constructor(options: ErrorLoggerOptions = {}) {
    this.options = {
      shouldIncludeStack: true,
      environment: import.meta.env.MODE as 'development' | 'production',
      version: import.meta.env.VITE_APP_VERSION,
      ...options
    }
  }

  private formatError(error: AppError) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      stack: this.options.shouldIncludeStack ? error.stack : undefined,
      context: error.context,
      environment: this.options.environment,
      version: this.options.version,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  }

  async logError(error: AppError) {
    const errorData = this.formatError(error)

    if (this.options.environment === 'development') {
      console.error('[Error Logger]', errorData)
      return
    }

    try {
      // 실제 프로덕션 환경에서는 에러 로깅 서비스로 전송
      // await fetch('/api/error-logs', {
      //   method: 'POST',
      //   body: JSON.stringify(errorData)
      // })
      console.error('[Error Logger] Production:', errorData)
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError)
    }
  }
}

export const errorLogger = new ErrorLogger() 