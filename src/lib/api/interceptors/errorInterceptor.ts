import { toast } from 'react-hot-toast'
import type { AxiosError } from 'axios'
import { 
  ErrorCode, 
  createError, 
  createNetworkError,
  createValidationError 
} from '../../../types/error'
import { errorLogger } from '../../error/errorLogger'
import { retryHandler } from '../retryHandler'
import { sessionHandler } from '../../auth/sessionHandler'
import axios from 'axios'
import type { RetryableRequestConfig } from '../types'
import { offlineManager } from '../../network/offlineManager'
import { v4 as uuidv4 } from 'uuid'

export const errorInterceptor = async (error: AxiosError) => {
  if (!error.response) {
    const networkError = createNetworkError(
      '네트워크 연결에 실패했습니다',
      { 
        url: error.config?.url || '',
        method: error.config?.method || ''
      }
    )

    // 오프라인 상태일 때 요청 큐잉
    if (!navigator.onLine && error.config) {
      const requestId = uuidv4()
      offlineManager.enqueue(requestId, () => axios(error.config!))
      return Promise.reject(networkError)
    }

    toast.error(networkError.message)
    return Promise.reject(networkError)
  }

  const { status, data } = error.response
  interface ErrorResponseData {
    fieldErrors?: Record<string, string[]>
  }
  const errorData = data as ErrorResponseData
  
  let appError

  switch(status) {
    case 400:
      appError = errorData.fieldErrors
        ? createValidationError(errorData.fieldErrors)
        : createError(ErrorCode.BAD_REQUEST, '잘못된 요청입니다')
      break
    case 401:
      appError = createError(ErrorCode.UNAUTHORIZED, '인증이 필요합니다')
      break
    case 403:
      appError = createError(ErrorCode.FORBIDDEN, '접근 권한이 없습니다')
      break
    case 404:
      appError = createError(ErrorCode.NOT_FOUND, '요청한 리소스를 찾을 수 없습니다')
      break
    default:
      appError = createError(
        ErrorCode.INTERNAL_SERVER,
        '서버 오류가 발생했습니다'
      )
  }

  // 세션 만료 처리
  if (appError.code === ErrorCode.UNAUTHORIZED) {
    const sessionRefreshed = await sessionHandler.handleAuthError(appError)
    if (sessionRefreshed && error.config) {
      // 토큰이 갱신되었다면 원래 요청 재시도
      return axios(error.config)
    }
  }

  // 재시도 로직
  const retryConfig = await retryHandler.retryRequest(
    error.config as RetryableRequestConfig || {},
    error,
    (error.config as RetryableRequestConfig)?.retryCount || 0
  )

  if (retryConfig) {
    return axios(retryConfig)
  }

  // 에러 로깅
  errorLogger.logError(appError)
  
  toast.error(appError.message)
  return Promise.reject(appError)
}
