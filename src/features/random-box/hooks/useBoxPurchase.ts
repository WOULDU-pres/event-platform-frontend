import { useState } from 'react'
import { useRandomBoxPurchase } from '../api/randomBoxApi'
import { useRandomBoxStore } from '../stores'
import { getUserUuid } from '../utils/uuidGenerator'

/**
 * 랜덤박스 구매 및 결과 처리를 위한 훅
 * @returns 구매 실행 함수, 로딩 상태, 에러 상태, 결과 핸들링 함수들
 */
export const useBoxPurchase = () => {
  // 상태 관리
  const [isAnimating, setIsAnimating] = useState(false)
  const { 
    selectedBoxId, 
    setRecentPurchase, 
    setRecentPurchaseResult, 
    setIsOpeningBox, 
    setShowResultModal 
  } = useRandomBoxStore()
  
  // API 뮤테이션
  const purchaseMutation = useRandomBoxPurchase()
  
  // 로딩 및 에러 상태
  const isLoading = purchaseMutation.isPending || isAnimating
  const error = purchaseMutation.error
  
  /**
   * 박스 구매 실행 함수
   */
  const purchaseBox = async () => {
    if (!selectedBoxId) {
      throw new Error('선택된 박스가 없습니다.')
    }
    
    // 애니메이션 상태 시작
    setIsAnimating(true)
    setIsOpeningBox(true)
    
    try {
      const userUuid = getUserUuid()
      
      // 구매 API 호출
      const result = await purchaseMutation.mutateAsync({ 
        boxId: selectedBoxId,
        userUuid
      })
      
      // 구매 결과 저장
      setRecentPurchase(result.data.purchase)
      setRecentPurchaseResult(result.data.result)
      
      // 애니메이션 타이밍 조정 (실제로는 컴포넌트에서 애니메이션 완료 후 호출)
      return result.data
    } catch (err) {
      // 에러 발생 시 애니메이션 상태 리셋
      cancelAnimation()
      throw err
    }
  }
  
  /**
   * 박스 열기 애니메이션 완료 핸들러
   */
  const completeAnimation = () => {
    setIsAnimating(false)
    setIsOpeningBox(false)
    setShowResultModal(true)
  }
  
  /**
   * 애니메이션 취소 핸들러
   */
  const cancelAnimation = () => {
    setIsAnimating(false)
    setIsOpeningBox(false)
    setShowResultModal(false)
  }
  
  /**
   * 결과 모달 닫기 핸들러
   */
  const closeResultModal = () => {
    setShowResultModal(false)
  }
  
  return {
    purchaseBox,
    isLoading,
    error,
    completeAnimation,
    cancelAnimation,
    closeResultModal
  }
} 