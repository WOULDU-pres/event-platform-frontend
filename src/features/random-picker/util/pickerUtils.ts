import { PickerStatus, PickerItem, PickerConfig } from '../types/picker'
import { STATUS_COLORS, STATUS_TEXT } from '../constants/pickerConstants'
import { nanoid } from 'nanoid'

/**
 * 피커 상태에 해당하는 태그 색상을 반환합니다.
 */
export const getStatusTagColor = (status: PickerStatus): string => {
  return STATUS_COLORS[status] || 'default'
}

/**
 * 피커 상태에 해당하는 텍스트를 반환합니다.
 */
export const getStatusText = (status: PickerStatus): string => {
  return STATUS_TEXT[status] || '알 수 없음'
}

/**
 * 줄바꿈으로 구분된 텍스트를 항목 배열로 변환합니다.
 */
export const textToItems = (text: string): PickerItem[] => {
  return text
    .split('\n')
    .map(item => item.trim())
    .filter(item => item.length > 0)
    .map(content => ({
      id: nanoid(),
      content,
      weight: 1 // 기본 가중치
    }))
}

/**
 * 항목 배열을 줄바꿈으로 구분된 텍스트로 변환합니다.
 */
export const itemsToText = (items: Array<{ content: string }>): string => {
  return items.map(item => item.content).join('\n')
}

/**
 * 랜덤 선택 결과를 클립보드에 복사할 수 있는 텍스트로 변환합니다.
 */
export const resultToClipboardText = (pickedItems: Array<{ content: string }>): string => {
  return pickedItems
    .map((item, index) => `${index + 1}. ${item.content}`)
    .join('\n')
}

/**
 * 빈 피커 설정을 생성합니다.
 */
export const createEmptyPicker = (): PickerConfig => {
  return {
    id: nanoid(),
    title: '',
    description: '',
    items: [],
    pickCount: 1,
    allowDuplicates: false,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

/**
 * 날짜를 보기 좋게 포맷팅합니다.
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return '유효하지 않은 날짜'
  }
}

/**
 * 클립보드에 텍스트를 복사합니다.
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('클립보드 복사 실패:', err)
    return false
  }
} 