import React from 'react'
import type { AppError } from '../../../types/error'
import ErrorFallback from './ErrorFallback'
import { ErrorCode } from '../../../types/error'
import { errorLogger } from '../errorLogger'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: AppError }>
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: AppError | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: AppError } {
    return {
      hasError: true,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        code: ErrorCode.UNKNOWN_ERROR
      }
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = {
      ...error,
      code: ErrorCode.UNKNOWN_ERROR,
      context: { errorInfo },
      timestamp: new Date().toISOString()
    } as AppError
    
    errorLogger.logError(appError)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || ErrorFallback
      return <FallbackComponent error={this.state.error!} />
    }

    return this.props.children
  }
}

export default ErrorBoundary 