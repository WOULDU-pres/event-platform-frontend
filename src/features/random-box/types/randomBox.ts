// 랜덤박스 이벤트 상태
type RandomBoxEventStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

// 박스 유형
type BoxType = 'BASIC' | 'PREMIUM' | 'DELUXE' | 'LIMITED'

// 획득 아이템 카테고리
type ItemCategory = 'PHYSICAL' | 'DIGITAL' | 'COUPON' | 'POINT'

// 랜덤박스 이벤트 기본 정보
interface RandomBoxEvent {
  id: string
  title: string
  description: string
  imageUrl?: string
  startDate: string
  endDate: string
  status: RandomBoxEventStatus
  boxTypes: RandomBox[]
  createdAt: string
  updatedAt: string
}

// 랜덤박스 정보
interface RandomBox {
  id: string
  eventId: string
  name: string
  description: string
  imageUrl?: string
  price: number
  type: BoxType
  itemPool: RandomBoxItem[]
  soldCount: number
  maxQuantity: number // 판매 가능한 최대 수량
}

// 랜덤박스 내부 아이템 정보
interface RandomBoxItem {
  id: string
  boxId: string
  name: string
  description: string
  imageUrl?: string
  category: ItemCategory
  value: number // 포인트나 쿠폰의 경우 금액, 물품의 경우 시장가치
  probability: number // 획득 확률 (0~100)
}

// 랜덤박스 구매 정보
interface RandomBoxPurchase {
  id: string
  boxId: string
  eventId: string
  userUuid: string
  purchaseDate: string
  result: RandomBoxPurchaseResult
}

// 랜덤박스 구매 결과
interface RandomBoxPurchaseResult {
  id: string
  purchaseId: string
  itemId: string
  item: RandomBoxItem
  revealedAt: string
}

// 랜덤박스 구매 요청
interface RandomBoxPurchaseRequest {
  boxId: string
  userUuid: string
}

// 확률 표시 정보
interface ProbabilityDisplay {
  category: ItemCategory
  probability: number
}

// 이벤트 정보
interface RandomBoxEventInfo {
  id: string
  title: string
  description: string
  rules: string
  startDate: string
  endDate: string
  isActive: boolean
}

export type {
  RandomBoxEventStatus,
  BoxType,
  ItemCategory,
  RandomBoxEvent,
  RandomBox,
  RandomBoxItem,
  RandomBoxPurchase,
  RandomBoxPurchaseResult,
  RandomBoxPurchaseRequest,
  ProbabilityDisplay,
  RandomBoxEventInfo
} 