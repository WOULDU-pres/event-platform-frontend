export * from './randomBox'

// 랜덤박스 타입 정의
export type RandomBoxType = 'NORMAL' | 'RARE' | 'EPIC' | 'LEGENDARY'

// 아이템 카테고리 정의
export type ItemCategory = 'PHYSICAL' | 'DIGITAL' | 'COUPON' | 'POINT'

// 랜덤박스 아이템 정의
export interface RandomBoxItem {
  id: string
  name: string
  description: string
  imageUrl?: string
  category: ItemCategory
  probability: number
  value?: number // 아이템의 가치 (원)
}

// 랜덤박스 정의
export interface RandomBox {
  id: string
  name: string
  description: string
  imageUrl?: string
  type: RandomBoxType
  price: number
  maxQuantity: number
  soldCount: number
  itemPool: RandomBoxItem[]
}

// 랜덤박스 구매 결과
export interface RandomBoxPurchaseResult {
  revealedAt(revealedAt: any): import("react").ReactNode
  id: string
  boxId: string
  boxName: string // 랜덤박스 이름
  item: RandomBoxItem
  acquiredAt: string // ISO 8601 형식의 문자열 날짜
  userId: string
}

// 구매 내역 아이템 정의
export interface PurchaseHistoryItem {
  id: string
  boxName: string
  item: RandomBoxItem
  acquiredAt: string
  purchaseId: string
}

// 이벤트 정보 정의
export interface EventInfo {
  id: string
  title: string
  description: string
  bannerUrl?: string
  startDate: string
  endDate: string
  isActive: boolean
  rules: string[]
} 