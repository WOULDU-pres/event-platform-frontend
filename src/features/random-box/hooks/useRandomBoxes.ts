import { useEffect } from 'react'
import { useRandomBoxEvents, useRandomBoxEventDetail, useRandomBoxDetail } from '../api/randomBoxApi'
import { useRandomBoxStore } from '../stores'

/**
 * 랜덤박스 이벤트 및 박스 정보를 가져오는 훅
 * @returns 이벤트 목록, 선택된 이벤트, 선택된 박스, 로딩 상태, 에러 상태
 */
export const useRandomBoxes = () => {
  // 상태 관리
  const { selectedEventId, selectedBoxId, setSelectedEventId, setSelectedBoxId } = useRandomBoxStore()
  
  // 쿼리 실행
  const eventsQuery = useRandomBoxEvents('ACTIVE')
  const eventDetailQuery = useRandomBoxEventDetail(selectedEventId || '')
  const boxDetailQuery = useRandomBoxDetail(selectedBoxId || '')
  
  // 파생 데이터
  const events = eventsQuery.data?.data.events || []
  const selectedEvent = eventDetailQuery.data?.data.event
  const selectedBox = boxDetailQuery.data?.data.box
  
  // 로딩 및 에러 상태
  const isLoading = eventsQuery.isLoading || 
                    (!!selectedEventId && eventDetailQuery.isLoading) || 
                    (!!selectedBoxId && boxDetailQuery.isLoading)
  
  const error = eventsQuery.error || eventDetailQuery.error || boxDetailQuery.error
  
  // 이벤트가 로드되면 첫 번째 이벤트 자동 선택
  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id)
    }
  }, [events, selectedEventId, setSelectedEventId])
  
  // 선택된 이벤트의 첫 번째 박스 자동 선택
  useEffect(() => {
    if (
      selectedEvent && 
      selectedEvent.boxTypes && 
      selectedEvent.boxTypes.length > 0 && 
      (!selectedBoxId || !selectedEvent.boxTypes.some(box => box.id === selectedBoxId))
    ) {
      setSelectedBoxId(selectedEvent.boxTypes[0].id)
    }
  }, [selectedEvent, selectedBoxId, setSelectedBoxId])
  
  // 이벤트 선택 핸들러
  const selectEvent = (eventId: string) => {
    setSelectedEventId(eventId)
    setSelectedBoxId(null)
  }
  
  // 박스 선택 핸들러
  const selectBox = (boxId: string) => {
    setSelectedBoxId(boxId)
  }
  
  return {
    events,
    selectedEvent,
    selectedBox,
    isLoading,
    error,
    selectEvent,
    selectBox
  }
} 