import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import { 
  PickerState, 
  PickerConfig, 
  PickerItem,
  PickerResult,
  PickerExecuteOptions
} from '../types/picker'
import { MAX_HISTORY_ITEMS } from '../constants/pickerConstants'

/**
 * Random Picker 상태 관리를 위한 Zustand 스토어
 */
interface PickerStore extends PickerState {
  // 피커 관련 액션
  setPicker: (picker: PickerConfig | null) => void
  
  // 실행 상태 관련 액션
  setExecutionStatus: (status: PickerState['executionStatus']) => void
  
  // 실행 결과 관련 액션
  addResult: (result: PickerResult) => void
  setCurrentResult: (result: PickerResult | null) => void
  clearResults: () => void
  
  // 피커 실행 액션
  executePicker: (options: PickerExecuteOptions) => Promise<PickerResult>
}

// 기본 상태
const initialState: PickerState = {
  currentPicker: null,
  results: [],
  executionStatus: 'idle',
  currentResult: null
}

/**
 * 랜덤 선택 로직을 실행하는 유틸리티 함수
 */
const pickRandomItems = (
  items: PickerItem[], 
  count: number, 
  allowDuplicates: boolean
): PickerItem[] => {
  if (items.length === 0) return []
  
  const result: PickerItem[] = []
  const availableItems = [...items]
  
  // 중복을 허용하지 않을 경우, 선택 개수는 아이템 개수보다 많을 수 없음
  const actualCount = !allowDuplicates 
    ? Math.min(count, items.length) 
    : count
  
  for (let i = 0; i < actualCount; i++) {
    if (!allowDuplicates && availableItems.length === 0) break
    
    // 가중치에 따른 확률 계산을 위한 총 가중치 계산
    const totalWeight = availableItems.reduce((sum, item) => sum + item.weight, 0)
    let random = Math.random() * totalWeight
    
    // 가중치에 기반하여 항목 선택
    let selectedIndex = 0
    for (let j = 0; j < availableItems.length; j++) {
      random -= availableItems[j].weight
      if (random <= 0) {
        selectedIndex = j
        break
      }
    }
    
    // 선택된 항목 추가
    result.push(availableItems[selectedIndex])
    
    // 중복을 허용하지 않을 경우, 선택된 항목 제거
    if (!allowDuplicates) {
      availableItems.splice(selectedIndex, 1)
    }
  }
  
  return result
}

// 스토어 생성
export const usePickerStore = create<PickerStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // 현재 피커 설정
        setPicker: (picker) => set({ currentPicker: picker }),
        
        // 실행 상태 설정
        setExecutionStatus: (status) => set({ executionStatus: status }),
        
        // 결과 추가
        addResult: (result) => set((state) => {
          // 최대 히스토리 개수 유지
          const results = [result, ...state.results].slice(0, MAX_HISTORY_ITEMS)
          return { results }
        }),
        
        // 현재 결과 설정
        setCurrentResult: (result) => set({ currentResult: result }),
        
        // 결과 초기화
        clearResults: () => set({ results: [], currentResult: null }),
        
        // 피커 실행
        executePicker: async (options) => {
          const { pickerId, count, allowDuplicates } = options
          const { currentPicker } = get()
          
          // 현재 피커가 없거나 ID가 일치하지 않으면 에러
          if (!currentPicker || currentPicker.id !== pickerId) {
            throw new Error('피커를 찾을 수 없습니다')
          }
          
          // 실행 상태 설정
          set({ executionStatus: 'executing' })
          
          try {
            // 실제 API 요청 대신 로컬에서 실행 (데모 목적)
            const actualCount = count ?? currentPicker.pickCount
            const actualAllowDuplicates = 
              allowDuplicates ?? currentPicker.allowDuplicates
            
            // 랜덤 선택 실행
            const pickedItems = pickRandomItems(
              currentPicker.items,
              actualCount,
              actualAllowDuplicates
            )
            
            // 결과 생성
            const result: PickerResult = {
              id: nanoid(),
              pickerId,
              pickedItems,
              createdAt: new Date().toISOString(),
              pickedAt: new Date().toISOString()
            }
            
            // 약간의 지연으로 애니메이션 효과 부여
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // 결과 저장 및 상태 업데이트
            get().addResult(result)
            set({ 
              currentResult: result,
              executionStatus: 'completed'
            })
            
            return result
          } catch (error) {
            // 오류 발생 시 상태 업데이트
            set({ executionStatus: 'failed' })
            throw error
          }
        }
      }),
      {
        name: 'picker-storage',
        partialize: (state) => ({
          // 영구 저장할 상태만 선택
          results: state.results
        })
      }
    )
  )
) 