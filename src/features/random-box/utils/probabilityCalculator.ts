import { ItemCategory, RandomBoxItem, ProbabilityDisplay } from '../types'

/**
 * 아이템 카테고리별 확률 계산
 * @param items 아이템 배열
 * @returns 카테고리별 확률 정보 배열
 */
export const calculateCategoryProbabilities = (items: RandomBoxItem[]): ProbabilityDisplay[] => {
  if (!items || items.length === 0) {
    return []
  }
  
  // 카테고리별 확률 합계 계산
  const categoryProbabilities = items.reduce<Record<ItemCategory, number>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0
    }
    acc[item.category] += item.probability
    return acc
  }, {} as Record<ItemCategory, number>)
  
  // ProbabilityDisplay 배열로 변환
  return Object.entries(categoryProbabilities).map(([category, probability]) => ({
    category: category as ItemCategory,
    probability: Math.round(probability * 100) / 100 // 소수점 둘째 자리까지 반올림
  }))
}

/**
 * 확률에 기반하여 아이템 선택 시뮬레이션
 * @param items 아이템 배열
 * @returns 선택된 아이템 또는 null
 */
export const simulateItemSelection = (items: RandomBoxItem[]): RandomBoxItem | null => {
  if (!items || items.length === 0) {
    return null
  }
  
  // 총 확률 계산 (보통 100이지만, 확인을 위해)
  const totalProbability = items.reduce((sum, item) => sum + item.probability, 0)
  
  // 0에서 totalProbability 사이의 랜덤 값 생성
  const random = Math.random() * totalProbability
  
  // 누적 확률을 기반으로 아이템 선택
  let cumulativeProbability = 0
  for (const item of items) {
    cumulativeProbability += item.probability
    if (random < cumulativeProbability) {
      return item
    }
  }
  
  // 만약 계산 오류로 여기까지 왔다면 마지막 아이템 반환
  return items[items.length - 1]
}

/**
 * 확률을 가독성 있는 텍스트로 변환
 * @param probability 확률 값 (0-100)
 * @returns 가독성 있는 확률 문자열
 */
export const formatProbability = (probability: number): string => {
  if (probability < 0.01) {
    return '0.01% 미만'
  } else if (probability < 0.1) {
    return `${probability.toFixed(2)}%`
  } else if (probability < 1) {
    return `${probability.toFixed(1)}%`
  } else {
    return `${Math.round(probability)}%`
  }
} 