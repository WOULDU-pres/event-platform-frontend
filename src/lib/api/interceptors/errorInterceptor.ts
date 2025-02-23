import { toast } from 'react-hot-toast'
import type { AxiosError } from 'axios'

export const errorInterceptor = (error: AxiosError) => {
  const status = error.response?.status
  
  switch(status) {
    case 401:
      toast.error('인증이 필요합니다')
      break
    case 403:
      toast.error('접근 권한이 없습니다')
      break
    case 404:
      toast.error('요청한 리소스를 찾을 수 없습니다')
      break
    default:
      toast.error(`서버 오류 발생: ${error.message}`)
  }
  
  return Promise.reject(error)
}
