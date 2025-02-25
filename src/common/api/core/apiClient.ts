import axios from 'axios'
import useCommonStore from '../../stores/commonStore'

// API 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
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
  console.log('API 요청:', config.method?.toUpperCase(), config.url, config.data);
  return config
})

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (response) => {
    console.log('API 응답:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API 응답 오류:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient
