import axios from 'axios'
import useCommonStore from '../../../stores/commonStore'

// Axios 기본 인스턴스 생성 (싱글톤 패턴 적용)
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터: 모든 API 호출에 Member-ID 자동 주입
apiClient.interceptors.request.use(config => {
  const memberId = useCommonStore.getState().memberId
  if (memberId) {
    config.headers['X-Member-Id'] = memberId
  }
  return config
})

export default apiClient
