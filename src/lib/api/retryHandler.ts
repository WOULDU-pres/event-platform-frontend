import type { AxiosError } from 'axios'
import { ErrorCode } from '../../types/error'
import type { RetryableRequestConfig } from './types'

interface RetryConfig {
  maxRetries: number
  retryDelay: number
  retryableErrors: ErrorCode[]
}

export class RetryHandler {
  private config: RetryConfig

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      retryableErrors: [
        ErrorCode.NETWORK_ERROR,
        ErrorCode.TIMEOUT,
        ErrorCode.INTERNAL_SERVER
      ],
      ...config
    }
  }

  private shouldRetry(error: AxiosError, retryCount: number): boolean {
    if (retryCount >= this.config.maxRetries) return false
    
    const errorCode = error.response?.status
    return this.config.retryableErrors.some(code => 
      error.message.includes(code) || errorCode === this.getHttpStatus(code)
    )
  }

  private getHttpStatus(errorCode: ErrorCode): number {
    const statusMap: Partial<Record<ErrorCode, number>> = {
      [ErrorCode.INTERNAL_SERVER]: 500,
      [ErrorCode.BAD_REQUEST]: 400,
      [ErrorCode.UNAUTHORIZED]: 401,
      [ErrorCode.FORBIDDEN]: 403,
      [ErrorCode.NOT_FOUND]: 404,
      [ErrorCode.TIMEOUT]: 408,
      [ErrorCode.NETWORK_ERROR]: 0,
    }
    return statusMap[errorCode] || 0
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async retryRequest(
    requestConfig: RetryableRequestConfig,
    error: AxiosError,
    retryCount = 0
  ): Promise<RetryableRequestConfig | null> {
    if (!this.shouldRetry(error, retryCount)) {
      return null
    }

    await this.delay(this.config.retryDelay * Math.pow(2, retryCount))
    
    return {
      ...requestConfig,
      retryCount: retryCount + 1
    }
  }
}

export const retryHandler = new RetryHandler() 