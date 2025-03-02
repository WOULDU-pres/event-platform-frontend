import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../common/api/core/apiClient'
import { 
  RandomBoxEvent, 
  RandomBox, 
  RandomBoxPurchaseRequest,
  RandomBoxEventStatus
} from '../types'
import {
  ApiResponse, 
  RandomBoxEventsResponse, 
  RandomBoxEventDetailResponse, 
  RandomBoxDetailResponse,
  RandomBoxPurchaseResponse,
  RandomBoxPurchaseHistoryResponse
} from './types'

// 날짜 형식 변환 함수
const formatDateForServer = (dateString: string) => {
  if (!dateString) return dateString
  // ISO 형식에서 타임존 정보를 제거하고 서버 형식으로 변환
  return dateString.split('+')[0] // "2025-02-28T00:00:00"
}

// 서버에서 받은 날짜를 클라이언트 형식으로 변환
const formatDateFromServer = (dateString: string) => {
  if (!dateString) return dateString
  return new Date(dateString).toISOString()
}

// 백엔드 상태값을 프론트엔드 상태값으로 매핑
const mapBackendStatus = (status: string): RandomBoxEventStatus => {
  const statusMap: Record<string, RandomBoxEventStatus> = {
    'ACTIVE': 'ACTIVE',
    'UPCOMING': 'UPCOMING',
    'COMPLETED': 'COMPLETED',
    'DRAFT': 'DRAFT',
    'CANCELLED': 'CANCELLED'
  }
  return statusMap[status] || 'DRAFT'
}

// 랜덤박스 이벤트 목록 조회
export const useRandomBoxEvents = (status?: RandomBoxEventStatus) => {
  return useQuery<ApiResponse<RandomBoxEventsResponse>>({
    queryKey: ['random-box-events', status],
    queryFn: async () => {
      const params = status ? { status } : {}
      const response = await apiClient.get('/random-box/events', { params })
      
      // 응답 데이터 형식 변환
      const events = response.data.data.events.map((event: any) => ({
        ...event,
        startDate: formatDateFromServer(event.startDate),
        endDate: formatDateFromServer(event.endDate),
        status: mapBackendStatus(event.status)
      }))
      
      return {
        ...response.data,
        data: {
          ...response.data.data,
          events
        }
      }
    }
  })
}

// 랜덤박스 이벤트 상세 조회
export const useRandomBoxEventDetail = (eventId: string) => {
  return useQuery<ApiResponse<RandomBoxEventDetailResponse>>({
    queryKey: ['random-box-event', eventId],
    queryFn: async () => {
      const response = await apiClient.get(`/random-box/events/${eventId}`)
      
      // 응답 데이터 형식 변환
      const event = {
        ...response.data.data.event,
        startDate: formatDateFromServer(response.data.data.event.startDate),
        endDate: formatDateFromServer(response.data.data.event.endDate),
        status: mapBackendStatus(response.data.data.event.status)
      }
      
      return {
        ...response.data,
        data: {
          ...response.data.data,
          event
        }
      }
    },
    enabled: !!eventId
  })
}

// 랜덤박스 상세 조회
export const useRandomBoxDetail = (boxId: string) => {
  return useQuery<ApiResponse<RandomBoxDetailResponse>>({
    queryKey: ['random-box', boxId],
    queryFn: async () => {
      const response = await apiClient.get(`/random-box/boxes/${boxId}`)
      return response.data
    },
    enabled: !!boxId
  })
}

// 랜덤박스 구매
export const useRandomBoxPurchase = () => {
  const queryClient = useQueryClient()
  
  return useMutation<
    ApiResponse<RandomBoxPurchaseResponse>, 
    Error, 
    RandomBoxPurchaseRequest
  >({
    mutationFn: async (purchaseData) => {
      const response = await apiClient.post('/random-box/purchases', purchaseData)
      return response.data
    },
    onSuccess: (data, variables) => {
      // 구매 후 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['random-box', variables.boxId] })
      queryClient.invalidateQueries({ queryKey: ['random-box-purchases', variables.userUuid] })
    }
  })
}

// 사용자 구매 기록 조회
export const useRandomBoxPurchaseHistory = (userUuid: string) => {
  return useQuery<ApiResponse<RandomBoxPurchaseHistoryResponse>>({
    queryKey: ['random-box-purchases', userUuid],
    queryFn: async () => {
      const response = await apiClient.get('/random-box/purchases', {
        params: { userUuid }
      })
      return response.data
    },
    enabled: !!userUuid
  })
}

// 구매 결과 상세 조회
export const useRandomBoxPurchaseResult = (purchaseId: string) => {
  return useQuery<ApiResponse<RandomBoxPurchaseResponse>>({
    queryKey: ['random-box-purchase', purchaseId],
    queryFn: async () => {
      const response = await apiClient.get(`/random-box/purchases/${purchaseId}`)
      return response.data
    },
    enabled: !!purchaseId
  })
} 