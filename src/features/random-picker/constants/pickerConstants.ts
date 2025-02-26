import { PickerStatus } from '../types/picker'

// 상태 태그 색상
export const STATUS_COLORS: Record<PickerStatus, string> = {
  DRAFT: 'gold',
  SAVED: 'green'
}

// 상태 텍스트
export const STATUS_TEXT: Record<PickerStatus, string> = {
  DRAFT: '임시저장',
  SAVED: '저장됨'
}

// 기본 선택 개수
export const DEFAULT_PICK_COUNT = 1

// 최대 항목 개수 제한
export const MAX_ITEMS = 500

// 최대 선택 개수 제한
export const MAX_PICK_COUNT = 100

// 결과 저장 히스토리 최대 개수
export const MAX_HISTORY_ITEMS = 50

// 애니메이션 시간 (ms)
export const ANIMATION_DURATION = 2000 