import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  AttendanceEvent, 
  AttendanceEventStatus, 
  AttendanceParticipant,
  AttendanceStatus 
} from '../types/attendance'

interface AttendanceState {
  // 현재 활성화된 이벤트 (QR 스캔 등에 사용)
  currentEventId: string | null
  setCurrentEventId: (id: string | null) => void
  
  // 유저 상태 (QR 스캔 시 사용)
  currentUserId: string | null
  setCurrentUserId: (id: string | null) => void
  
  // 임시 저장 이벤트 (폼에서 작성 중인 이벤트)
  draftEvent: Partial<AttendanceEvent> | null
  setDraftEvent: (event: Partial<AttendanceEvent> | null) => void
  updateDraftEvent: (data: Partial<AttendanceEvent>) => void
  clearDraftEvent: () => void
  
  // 최근 방문한 이벤트 (최대 5개)
  recentEvents: string[]
  addRecentEvent: (id: string) => void
  clearRecentEvents: () => void
  
  // 필터링 및 검색 상태
  filterStatus: AttendanceEventStatus | 'all'
  setFilterStatus: (status: AttendanceEventStatus | 'all') => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  
  // QR 스캔 결과 임시 저장
  lastScanResult: {
    eventId: string
    success: boolean
    timestamp: number
    message: string
  } | null
  setLastScanResult: (result: {
    eventId: string
    success: boolean
    message: string
  } | null) => void
  clearLastScanResult: () => void
}

export const useAttendanceStore = create<AttendanceState>()(
  devtools(
    persist(
      (set) => ({
        // 현재 활성화된 이벤트
        currentEventId: null,
        setCurrentEventId: (id) => set({ currentEventId: id }),
        
        // 유저 상태
        currentUserId: null,
        setCurrentUserId: (id) => set({ currentUserId: id }),
        
        // 임시 저장 이벤트
        draftEvent: null,
        setDraftEvent: (event) => set({ draftEvent: event }),
        updateDraftEvent: (data) => set((state) => ({
          draftEvent: state.draftEvent ? { ...state.draftEvent, ...data } : data
        })),
        clearDraftEvent: () => set({ draftEvent: null }),
        
        // 최근 방문한 이벤트
        recentEvents: [],
        addRecentEvent: (id) => set((state) => {
          const filteredEvents = state.recentEvents.filter((eventId) => eventId !== id)
          return {
            recentEvents: [id, ...filteredEvents].slice(0, 5)
          }
        }),
        clearRecentEvents: () => set({ recentEvents: [] }),
        
        // 필터링 및 검색 상태
        filterStatus: 'all',
        setFilterStatus: (status) => set({ filterStatus: status }),
        searchTerm: '',
        setSearchTerm: (term) => set({ searchTerm: term }),
        
        // QR 스캔 결과 임시 저장
        lastScanResult: null,
        setLastScanResult: (result) => set({
          lastScanResult: result ? {
            ...result,
            timestamp: Date.now()
          } : null
        }),
        clearLastScanResult: () => set({ lastScanResult: null })
      }),
      {
        name: 'attendance-store',
        partialize: (state) => ({
          currentEventId: state.currentEventId,
          currentUserId: state.currentUserId,
          draftEvent: state.draftEvent,
          recentEvents: state.recentEvents,
          filterStatus: state.filterStatus
        })
      }
    )
  )
) 