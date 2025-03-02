import { ItemCategory, BoxType } from '../types'

// API 엔드포인트
export const RANDOM_BOX_API = {
  EVENTS: '/random-box/events',
  BOXES: '/random-box/boxes',
  PURCHASES: '/random-box/purchases'
}

// 랜덤박스 상태별 표시 텍스트
export const STATUS_TEXT = {
  DRAFT: '준비 중',
  UPCOMING: '진행 예정',
  ACTIVE: '진행 중',
  COMPLETED: '종료됨',
  CANCELLED: '취소됨'
}

// 랜덤박스 상태별 배지 색상
export const STATUS_COLOR = {
  DRAFT: '#8c8c8c',
  UPCOMING: '#1890ff',
  ACTIVE: '#52c41a',
  COMPLETED: '#d9d9d9',
  CANCELLED: '#ff4d4f'
}

// 박스 유형별 표시 텍스트
export const BOX_TYPE_TEXT: Record<BoxType, string> = {
  BASIC: '기본',
  PREMIUM: '프리미엄',
  DELUXE: '디럭스',
  LIMITED: '한정판'
}

// 박스 유형별 색상
export const BOX_TYPE_COLOR: Record<BoxType, string> = {
  BASIC: '#8c8c8c',
  PREMIUM: '#1890ff',
  DELUXE: '#722ed1',
  LIMITED: '#f5222d'
}

// 아이템 카테고리별 표시 텍스트
export const ITEM_CATEGORY_TEXT: Record<ItemCategory, string> = {
  PHYSICAL: '실물 상품',
  DIGITAL: '디지털 상품',
  COUPON: '할인 쿠폰',
  POINT: '포인트'
}

// 아이템 카테고리별 색상
export const ITEM_CATEGORY_COLOR: Record<ItemCategory, string> = {
  PHYSICAL: '#fa8c16',
  DIGITAL: '#13c2c2',
  COUPON: '#eb2f96',
  POINT: '#faad14'
}

// 랜덤박스 애니메이션 설정
export const ANIMATION_CONFIG = {
  OPEN_DURATION: 2000, // 박스 열기 애니메이션 시간 (ms)
  REVEAL_DELAY: 500,   // 아이템 공개 딜레이 (ms)
  CONFETTI_DURATION: 3000 // 축하 효과 지속 시간 (ms)
}

// 페이지네이션 설정
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50']
}

// 결과 화면 공유 설정
export const SHARE_CONFIG = {
  TITLE: '랜덤박스에서 아이템을 획득했어요!',
  DESCRIPTION: '이벤트 플랫폼 랜덤박스에서 획득한 아이템입니다. 당신도 도전해보세요!',
  HASHTAGS: ['이벤트플랫폼', '랜덤박스', '럭키박스', '행운']
} 