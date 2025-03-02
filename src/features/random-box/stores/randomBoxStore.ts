import { create } from 'zustand'
import { 
  RandomBoxEvent, 
  RandomBox, 
  RandomBoxItem, 
  RandomBoxPurchase, 
  RandomBoxPurchaseResult 
} from '../types'

interface RandomBoxStore {
  // 현재 선택된 이벤트 및 박스 ID
  selectedEventId: string | null
  selectedBoxId: string | null
  
  // 최근 구매 정보
  recentPurchase: RandomBoxPurchase | null
  recentPurchaseResult: RandomBoxPurchaseResult | null
  
  // 박스 열기 애니메이션 상태
  isOpeningBox: boolean
  showResultModal: boolean
  
  // 액션
  setSelectedEventId: (id: string | null) => void
  setSelectedBoxId: (id: string | null) => void
  setRecentPurchase: (purchase: RandomBoxPurchase | null) => void
  setRecentPurchaseResult: (result: RandomBoxPurchaseResult | null) => void
  setIsOpeningBox: (isOpening: boolean) => void
  setShowResultModal: (show: boolean) => void
  resetSelections: () => void
  resetPurchaseState: () => void
}

export const useRandomBoxStore = create<RandomBoxStore>((set) => ({
  // 초기 상태
  selectedEventId: null,
  selectedBoxId: null,
  recentPurchase: null,
  recentPurchaseResult: null,
  isOpeningBox: false,
  showResultModal: false,
  
  // 액션
  setSelectedEventId: (id) => set({ selectedEventId: id }),
  setSelectedBoxId: (id) => set({ selectedBoxId: id }),
  setRecentPurchase: (purchase) => set({ recentPurchase: purchase }),
  setRecentPurchaseResult: (result) => set({ recentPurchaseResult: result }),
  setIsOpeningBox: (isOpening) => set({ isOpeningBox: isOpening }),
  setShowResultModal: (show) => set({ showResultModal: show }),
  
  // 복합 액션
  resetSelections: () => set({ 
    selectedEventId: null, 
    selectedBoxId: null 
  }),
  resetPurchaseState: () => set({
    recentPurchase: null,
    recentPurchaseResult: null,
    isOpeningBox: false,
    showResultModal: false
  })
})) 