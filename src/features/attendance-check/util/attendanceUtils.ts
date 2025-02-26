import { format, isValid, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { 
  AttendanceEvent, 
  AttendanceEventStatus, 
  AttendanceStatus 
} from '../types/attendance'
import { 
  ATTENDANCE_EVENT_STATUS_TEXT, 
  ATTENDANCE_STATUS_TEXT,
  ATTENDANCE_EVENT_STATUS_COLORS,
  ATTENDANCE_STATUS_COLORS
} from '../constants/attendanceConstants'

/**
 * 날짜 형식을 안전하게 변환하는 함수
 * 날짜 형식이 올바르지 않은 경우 기본값 또는 '날짜 없음' 반환
 */
export const safeFormatDate = (
  dateString: string | undefined | null, 
  formatStr: string = 'yyyy-MM-dd HH:mm', 
  defaultText: string = '날짜 없음'
): string => {
  if (!dateString) return defaultText
  
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return defaultText
    return format(date, formatStr, { locale: ko })
  } catch (error) {
    return defaultText
  }
}

/**
 * 이벤트 상태에 따른 텍스트 반환
 */
export const getEventStatusText = (status: AttendanceEventStatus): string => {
  return ATTENDANCE_EVENT_STATUS_TEXT[status] || '알 수 없음'
}

/**
 * 참석자 상태에 따른 텍스트 반환
 */
export const getAttendanceStatusText = (status: AttendanceStatus): string => {
  return ATTENDANCE_STATUS_TEXT[status] || '알 수 없음'
}

/**
 * 이벤트 상태에 따른 색상 반환
 */
export const getEventStatusColor = (status: AttendanceEventStatus): string => {
  return ATTENDANCE_EVENT_STATUS_COLORS[status] || 'default'
}

/**
 * 참석자 상태에 따른 색상 반환
 */
export const getAttendanceStatusColor = (status: AttendanceStatus): string => {
  return ATTENDANCE_STATUS_COLORS[status] || 'default'
}

/**
 * 이벤트가 활성 상태인지 확인
 */
export const isEventActive = (event?: AttendanceEvent | null): boolean => {
  if (!event) return false
  return event.status === 'ACTIVE'
}

/**
 * 출석 비율 계산 (%)
 */
export const calculateAttendanceRate = (present: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((present / total) * 100)
}

/**
 * 지각 비율 계산 (%)
 */
export const calculateLateRate = (late: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((late / total) * 100)
}

/**
 * 결석 비율 계산 (%)
 */
export const calculateAbsentRate = (absent: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((absent / total) * 100)
}

/**
 * 남은 시간을 '분:초' 형식으로 변환
 */
export const formatRemainingTime = (seconds: number): string => {
  if (seconds <= 0) return '00:00'
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * 날짜 범위 텍스트 생성 (시작일-종료일)
 */
export const formatDateRange = (
  startDate?: string | null, 
  endDate?: string | null,
  formatStr: string = 'MM.dd HH:mm'
): string => {
  const start = startDate ? safeFormatDate(startDate, formatStr) : '시작일 없음'
  const end = endDate ? safeFormatDate(endDate, formatStr) : '종료일 없음'
  
  return `${start} - ${end}`
} 