import { useState, useEffect } from 'react'
import { useRandomBoxPurchaseHistory, useRandomBoxPurchaseResult } from '../api/randomBoxApi'
import { getUserUuid } from '../utils/uuidGenerator'
import { RandomBoxPurchase } from '../types'

interface UseUserResultsParams {
  initialPurchaseId?: string
}

/**
 * 사용자의 구매 기록 및 결과를 가져오는 훅
 * @param params 초기 구매 ID(특정 결과 페이지를 위한 옵션)
 * @returns 구매 기록, 선택된 구매, 로딩 상태, 에러 상태, 구매 선택 함수
 */
export const useUserResults = (params?: UseUserResultsParams) => {
  // 상태 관리
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(
    params?.initialPurchaseId || null
  )
  
  // 사용자 UUID 가져오기
  const userUuid = getUserUuid()
  
  // 쿼리 실행
  const purchaseHistoryQuery = useRandomBoxPurchaseHistory(userUuid)
  const purchaseResultQuery = useRandomBoxPurchaseResult(selectedPurchaseId || '')
  
  // 파생 데이터
  const purchases = purchaseHistoryQuery.data?.data.purchases || []
  const selectedPurchase = purchaseResultQuery.data?.data.purchase
  const selectedResult = purchaseResultQuery.data?.data.result
  
  // 로딩 및 에러 상태
  const isLoading = purchaseHistoryQuery.isLoading || 
                    (!!selectedPurchaseId && purchaseResultQuery.isLoading)
  
  const error = purchaseHistoryQuery.error || purchaseResultQuery.error
  
  // 특정 구매 없을 때 첫 번째 구매 자동 선택 (결과 페이지가 아닌 경우)
  useEffect(() => {
    if (purchases.length > 0 && !selectedPurchaseId && !params?.initialPurchaseId) {
      setSelectedPurchaseId(purchases[0].id)
    }
  }, [purchases, selectedPurchaseId, params?.initialPurchaseId])
  
  /**
   * 구매 선택 핸들러
   * @param purchaseId 선택할 구매 ID
   */
  const selectPurchase = (purchaseId: string) => {
    setSelectedPurchaseId(purchaseId)
  }
  
  return {
    purchases,
    selectedPurchase,
    selectedResult,
    isLoading,
    error,
    selectPurchase
  }
} 