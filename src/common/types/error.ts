export enum ErrorCode {
  // HTTP 에러
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVER = 'INTERNAL_SERVER',
  
  // 비즈니스 에러
  INVALID_INPUT = 'INVALID_INPUT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  RESOURCE_EXPIRED = 'RESOURCE_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // 클라이언트 에러
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AppError extends Error {
  code: ErrorCode
  context?: Record<string, unknown>
  timestamp: string
  statusCode?: number
  originalError?: unknown
}

export interface ValidationError extends AppError {
  code: ErrorCode.INVALID_INPUT
  fieldErrors: Record<string, string[]>
}

export interface NetworkError extends AppError {
  code: ErrorCode.NETWORK_ERROR
  requestUrl?: string
  requestMethod?: string
}

export interface BusinessError extends AppError {
  businessCode: string
  userMessage: string
  systemMessage?: string
}

// 에러 생성 유틸리티 함수들
export const createError = (
  code: ErrorCode,
  message: string,
  context?: Record<string, unknown>
): AppError => ({
  name: 'AppError',
  code,
  message,
  context,
  timestamp: new Date().toISOString(),
  stack: new Error().stack
})

export const createValidationError = (
  fieldErrors: Record<string, string[]>
): ValidationError => ({
  name: 'ValidationError',
  code: ErrorCode.INVALID_INPUT,
  message: '입력값이 올바르지 않습니다',
  fieldErrors,
  timestamp: new Date().toISOString(),
  stack: new Error().stack
})

export const createNetworkError = (
  message: string,
  requestInfo?: { url: string; method: string }
): NetworkError => ({
  name: 'NetworkError',
  code: ErrorCode.NETWORK_ERROR,
  message,
  requestUrl: requestInfo?.url,
  requestMethod: requestInfo?.method,
  timestamp: new Date().toISOString(),
  stack: new Error().stack
})

export interface ErrorBoundaryState {
  hasError: boolean
  error?: AppError | null
} 