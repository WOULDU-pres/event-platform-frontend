import { useState, useCallback } from 'react'
import { usePickerStore } from '../stores/pickerStore'
import { PickerItem, PickerResult } from '../types/picker'
import { ANIMATION_DURATION } from '../constants/pickerConstants'

interface UseRandomPickerOptions {
  onAnimationStart?: () => void
  onAnimationEnd?: () => void
  onComplete?: (result: PickerResult) => void
  onError?: (error: Error) => void
}

export function useRandomPicker(options: UseRandomPickerOptions = {}) {
  const { 
    currentPicker,
    executionStatus,
    currentResult,
    executePicker
  } = usePickerStore()
  
  const [isAnimating, setIsAnimating] = useState(false)
  
  // 랜덤 선택 실행
  const executeRandomPick = useCallback(async (
    count?: number,
    allowDuplicates?: boolean
  ) => {
    if (!currentPicker) {
      const error = new Error('뽑기가 설정되지 않았습니다')
      options.onError?.(error)
      return
    }
    
    try {
      // 애니메이션 시작
      setIsAnimating(true)
      options.onAnimationStart?.()
      
      // 선택 실행
      const result = await executePicker({
        pickerId: currentPicker.id,
        count,
        allowDuplicates
      })
      
      // 애니메이션 타이머 설정
      setTimeout(() => {
        setIsAnimating(false)
        options.onAnimationEnd?.()
        options.onComplete?.(result)
      }, ANIMATION_DURATION)
      
      return result
    } catch (error) {
      setIsAnimating(false)
      options.onAnimationEnd?.()
      options.onError?.(error instanceof Error ? error : new Error('알 수 없는 오류'))
    }
  }, [currentPicker, executePicker, options])
  
  // 항목 셔플 애니메이션을 위한 임시 항목 생성
  const getShuffledItems = useCallback((): PickerItem[] => {
    if (!currentPicker || !currentPicker.items.length) return []
    
    // 현재 항목 복사 후 셔플
    const items = [...currentPicker.items]
    
    // Fisher-Yates 알고리즘을 사용한 셔플
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[items[i], items[j]] = [items[j], items[i]]
    }
    
    return items
  }, [currentPicker])
  
  return {
    executeRandomPick,
    getShuffledItems,
    isAnimating,
    executionStatus,
    currentResult,
    currentPicker
  }
} 