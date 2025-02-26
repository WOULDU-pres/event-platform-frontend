/**
 * Random Picker 관련 타입 정의
 */

// 피커 상태 타입
export type PickerStatus = 'DRAFT' | 'SAVED'

// 피커 항목 타입
export interface PickerItem {
  id: string
  content: string
  weight: number
}

// 피커 구성 타입
export interface PickerConfig {
  id: string
  title: string
  description?: string
  items: PickerItem[]
  pickCount: number
  allowDuplicates: boolean
  status: PickerStatus
  createdAt: string
  updatedAt: string
}

// 피커 폼 데이터 타입 (생성/수정용)
export interface PickerFormData {
  title: string
  description?: string
  items: string | PickerItem[]
  pickCount: number
  allowDuplicates: boolean
  status: PickerStatus
}

// 피커 선택 결과 타입
export interface PickerResult {
  id: string
  pickerId: string
  pickedItems: PickerItem[]
  createdAt: string
  pickedAt: string
}

// 피커 실행 옵션
export interface PickerExecuteOptions {
  pickerId: string
  count?: number
  allowDuplicates?: boolean
}

// 피커 스토어 상태 타입
export interface PickerState {
  currentPicker: PickerConfig | null
  results: PickerResult[]
  executionStatus: 'idle' | 'executing' | 'completed' | 'failed'
  currentResult: PickerResult | null
} 