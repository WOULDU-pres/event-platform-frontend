import type { AxiosRequestConfig } from 'axios'

export interface RetryableRequestConfig extends AxiosRequestConfig {
  retryCount?: number
} 