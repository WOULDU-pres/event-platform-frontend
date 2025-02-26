// 출석체크 이벤트 상태
export type AttendanceEventStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

// 참석자 상태
export type AttendanceStatus = 'PENDING' | 'PRESENT' | 'LATE' | 'ABSENT'

// 출석체크 이벤트 인터페이스
export interface AttendanceEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  imageUrl?: string
  status: AttendanceEventStatus
  organizerId: string
  organizerName: string
  maxParticipants: number
  currentParticipants: number
  checkInMethod: 'QR' | 'MANUAL' | 'BOTH'
  allowLateCheckIn: boolean
  lateThresholdMinutes: number
  qrCodeEnabled: boolean
  qrCodeValidMinutes: number
  createdAt: string
  updatedAt: string
}

// 출석체크 이벤트 폼 데이터
export interface AttendanceEventFormData {
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  imageUrl?: string
  maxParticipants: number
  checkInMethod: 'QR' | 'MANUAL' | 'BOTH'
  allowLateCheckIn: boolean
  lateThresholdMinutes: number
  qrCodeEnabled: boolean
  qrCodeValidMinutes: number
  status?: AttendanceEventStatus
}

// 참석자 정보
export interface AttendanceParticipant {
  id: string
  eventId: string
  userId: string
  name: string
  email: string
  phone?: string
  status: AttendanceStatus
  checkInTime?: string
  checkInMethod?: 'QR' | 'MANUAL'
  notes?: string
  createdAt: string
  updatedAt: string
}

// QR 코드 정보
export interface AttendanceQRCode {
  code: string
  eventId: string
  createdAt: string
  expiresAt: string
  validMinutes: number
}

// 통계 데이터
export interface AttendanceStatistics {
  eventId: string
  totalParticipants: number
  presentCount: number
  lateCount: number
  absentCount: number
  pendingCount: number
  presentRate: number
  participationRate: number
  checkInTimesDistribution?: {
    hour: number
    count: number
  }[]
  lateArrivalMinutes?: {
    averageMinutes: number
    maxMinutes: number
  }
  participantDetails?: {
    id: string
    name: string
    status: AttendanceStatus
    checkInTime?: string
    checkInMethod?: 'QR' | 'MANUAL'
  }[]
  dailyAttendance?: {
    date: string
    count: number
  }[]
}

// 체크인 요청
export interface CheckInRequest {
  code: string
  participantId?: string
  userId?: string
}

// 참석자 상태 업데이트 요청
export interface UpdateParticipantStatusRequest {
  eventId: string
  participantId: string
  status: AttendanceStatus
  notes?: string
}