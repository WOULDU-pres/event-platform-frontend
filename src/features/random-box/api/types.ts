import { RandomBoxEvent, RandomBox, RandomBoxItem, RandomBoxPurchase, RandomBoxPurchaseResult } from '../types'

// API 응답 타입 정의
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
}

// 랜덤박스 이벤트 목록 응답
export interface RandomBoxEventsResponse {
  events: RandomBoxEvent[]
  total: number
}

// 랜덤박스 이벤트 상세 응답
export interface RandomBoxEventDetailResponse {
  event: RandomBoxEvent
  boxes: RandomBox[]
}

// 랜덤박스 상세 응답
export interface RandomBoxDetailResponse {
  box: RandomBox
  items: RandomBoxItem[]
}

// 랜덤박스 구매 응답
export interface RandomBoxPurchaseResponse {
  purchase: RandomBoxPurchase
  result: RandomBoxPurchaseResult
}

// 랜덤박스 구매 기록 응답
export interface RandomBoxPurchaseHistoryResponse {
  purchases: RandomBoxPurchase[]
  total: number
} 