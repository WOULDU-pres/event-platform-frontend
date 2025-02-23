// src/hooks/useApiClient.ts
import apiClient from '../api/core/apiClient' // 원본 인스턴스 직접 임포트
import useCommonStore from '../stores/commonStore'

// API 클라이언트 확장 훅
const useEnhancedApiClient = () => {
  const { memberId } = useCommonStore()
  
  // 요청 인터셉터 동적 주입
  apiClient.interceptors.request.use(config => {
    if (memberId) {
      config.headers['X-Member-Id'] = memberId
    }
    return config
  })

  return apiClient
}

export default useEnhancedApiClient // ✅ 명확한 네이밍
