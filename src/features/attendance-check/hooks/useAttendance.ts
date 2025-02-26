import { useState, useCallback, useMemo } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { 
  useAttendanceEvents, 
  useCreateAttendanceEvent,
  useGenerateQRCode,
  useCheckInWithQRCode,
  useAttendanceEventDetail,
  useAttendanceParticipants,
  useAttendanceStatistics,
  useDeleteAttendanceEvent,
  useUpdateAttendanceEvent
} from '../api/attendanceApi'
import type { 
  AttendanceEvent, 
  AttendanceEventFormData,
  AttendanceEventStatus
} from '../types/attendance'
import { 
  ATTENDANCE_ERROR_MESSAGES, 
  ATTENDANCE_SUCCESS_MESSAGES,
  ATTENDANCE_EVENT_STATUS
} from '../constants/attendanceConstants'

/**
 * 출석체크 목록 관리 훅
 */
export const useAttendanceList = () => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<AttendanceEventStatus | 'all'>('all')
  const { data: events, isLoading, error } = useAttendanceEvents()

  // 상태 필터링된 이벤트 목록
  const filteredEvents = useMemo(() => {
    if (!events) return []
    if (statusFilter === 'all') return events
    return events.filter(event => event.status === statusFilter)
  }, [events, statusFilter])

  // 이벤트 클릭시 이동
  const handleEventClick = useCallback((id: string) => {
    navigate(`/attendance/${id}`)
  }, [navigate])

  // 새 이벤트 생성 페이지로 이동
  const handleCreateClick = useCallback(() => {
    navigate('/attendance/create')
  }, [navigate])

  // 상태 필터 변경
  const handleStatusChange = useCallback((status: AttendanceEventStatus | 'all') => {
    setStatusFilter(status)
  }, [])

  // 에러 처리
  useCallback(() => {
    if (error) {
      message.error(ATTENDANCE_ERROR_MESSAGES.LOAD_EVENTS_FAILED)
    }
  }, [error])

  return {
    events: filteredEvents,
    isLoading,
    error,
    statusFilter,
    handleEventClick,
    handleCreateClick,
    handleStatusChange
  }
}

/**
 * 출석체크 상세 정보 관리 훅
 */
export const useAttendanceDetail = (eventId: string) => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  
  const { 
    data: event, 
    isLoading: isEventLoading, 
    error: eventError 
  } = useAttendanceEventDetail(eventId)
  
  const { 
    data: participants, 
    isLoading: isParticipantsLoading, 
    error: participantsError 
  } = useAttendanceParticipants(eventId)
  
  const { 
    data: statistics, 
    isLoading: isStatisticsLoading, 
    error: statisticsError 
  } = useAttendanceStatistics(eventId)
  
  const { mutate: deleteEvent } = useDeleteAttendanceEvent()

  // 이벤트 수정 페이지로 이동
  const handleEdit = useCallback(() => {
    navigate(`/attendance/${eventId}/edit`)
  }, [navigate, eventId])

  // 이벤트 삭제
  const handleDelete = useCallback(() => {
    deleteEvent(eventId, {
      onSuccess: () => {
        messageApi.success(ATTENDANCE_SUCCESS_MESSAGES.DELETE_EVENT_SUCCESS)
        navigate('/attendance')
      },
      onError: () => {
        messageApi.error(ATTENDANCE_ERROR_MESSAGES.DELETE_EVENT_FAILED)
      }
    })
  }, [deleteEvent, eventId, messageApi, navigate])

  // QR 코드 생성 페이지로 이동
  const handleGenerateQR = useCallback(() => {
    navigate(`/attendance/${eventId}/scan`)
  }, [navigate, eventId])

  // 통계 페이지로 이동
  const handleViewStats = useCallback(() => {
    navigate(`/attendance/${eventId}/statistics`)
  }, [navigate, eventId])

  // 이벤트가 활성 상태인지 확인
  const isEventActive = useMemo(() => {
    return event?.status === ATTENDANCE_EVENT_STATUS.ACTIVE
  }, [event])

  // 모든 로딩 상태
  const isLoading = isEventLoading || isParticipantsLoading || isStatisticsLoading

  // 에러 처리
  useCallback(() => {
    if (eventError) {
      messageApi.error(ATTENDANCE_ERROR_MESSAGES.LOAD_EVENT_FAILED)
    }
    if (participantsError) {
      messageApi.error(ATTENDANCE_ERROR_MESSAGES.LOAD_PARTICIPANTS_FAILED)
    }
    if (statisticsError) {
      messageApi.error(ATTENDANCE_ERROR_MESSAGES.LOAD_STATISTICS_FAILED)
    }
  }, [eventError, participantsError, statisticsError, messageApi])

  return {
    event,
    participants,
    statistics,
    isLoading,
    error: eventError || participantsError || statisticsError,
    isEventActive,
    contextHolder,
    handleEdit,
    handleDelete,
    handleCheckIn: () => navigate(`/attendance/${eventId}/scan`),
    handleGenerateQR,
    handleViewStats
  }
}

/**
 * 출석체크 생성 및 수정 훅
 */
export const useAttendanceForm = (initialData?: AttendanceEvent) => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  
  const { mutate: createEvent, isPending: isCreating } = useCreateAttendanceEvent()
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateAttendanceEvent()

  // 폼 제출 처리
  const handleSubmit = useCallback((formData: AttendanceEventFormData) => {
    if (initialData) {
      // 수정
      updateEvent({ eventId: initialData.id, data: formData }, {
        onSuccess: () => {
          messageApi.success(ATTENDANCE_SUCCESS_MESSAGES.UPDATE_EVENT_SUCCESS)
          navigate(`/attendance/${initialData.id}`)
        },
        onError: () => {
          messageApi.error(ATTENDANCE_ERROR_MESSAGES.UPDATE_EVENT_FAILED)
        }
      })
    } else {
      // 생성
      createEvent(formData, {
        onSuccess: (data) => {
          messageApi.success(ATTENDANCE_SUCCESS_MESSAGES.CREATE_EVENT_SUCCESS)
          navigate(`/attendance/${data.id}`)
        },
        onError: () => {
          messageApi.error(ATTENDANCE_ERROR_MESSAGES.CREATE_EVENT_FAILED)
        }
      })
    }
  }, [createEvent, updateEvent, initialData, messageApi, navigate])

  // 취소 처리
  const handleCancel = useCallback(() => {
    if (initialData) {
      navigate(`/attendance/${initialData.id}`)
    } else {
      navigate('/attendance')
    }
  }, [navigate, initialData])

  return {
    handleSubmit,
    handleCancel,
    isSubmitting: isCreating || isUpdating,
    contextHolder
  }
}

/**
 * QR 코드 스캔 및 관리 훅
 */
export const useAttendanceQR = (eventId: string, validMinutes: number = 5) => {
  const [messageApi, contextHolder] = message.useMessage()
  const { mutateAsync: checkIn, isPending: isCheckingIn } = useCheckInWithQRCode()
  
  // QR 코드로 체크인 처리
  const handleCheckIn = useCallback(async (code: string, eventId: string) => {
    try {
      await checkIn({ code, participantId: eventId })
      return true
    } catch (error) {
      throw error
    }
  }, [checkIn])
  
  return {
    handleCheckIn,
    isCheckingIn,
    contextHolder
  }
} 