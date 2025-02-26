// 출석체크 이벤트 상태값
export const ATTENDANCE_EVENT_STATUS = {
  DRAFT: 'DRAFT',
  UPCOMING: 'UPCOMING',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

// 참석자 상태값
export const ATTENDANCE_STATUS = {
  PENDING: 'PENDING',
  PRESENT: 'PRESENT',
  LATE: 'LATE',
  ABSENT: 'ABSENT',
} as const

// 상태값에 대한 한글 표시
export const ATTENDANCE_STATUS_TEXT = {
  [ATTENDANCE_STATUS.PENDING]: '대기',
  [ATTENDANCE_STATUS.PRESENT]: '출석',
  [ATTENDANCE_STATUS.LATE]: '지각',
  [ATTENDANCE_STATUS.ABSENT]: '결석',
} as const

// 이벤트 상태값에 대한 한글 표시
export const ATTENDANCE_EVENT_STATUS_TEXT = {
  [ATTENDANCE_EVENT_STATUS.DRAFT]: '임시저장',
  [ATTENDANCE_EVENT_STATUS.UPCOMING]: '예정',
  [ATTENDANCE_EVENT_STATUS.ACTIVE]: '진행중',
  [ATTENDANCE_EVENT_STATUS.COMPLETED]: '완료',
  [ATTENDANCE_EVENT_STATUS.CANCELLED]: '취소',
} as const

// 상태값에 대한 색상 정의
export const ATTENDANCE_STATUS_COLORS = {
  [ATTENDANCE_STATUS.PENDING]: 'default',
  [ATTENDANCE_STATUS.PRESENT]: 'success',
  [ATTENDANCE_STATUS.LATE]: 'warning',
  [ATTENDANCE_STATUS.ABSENT]: 'error',
} as const

// 이벤트 상태값에 대한 색상 정의
export const ATTENDANCE_EVENT_STATUS_COLORS = {
  [ATTENDANCE_EVENT_STATUS.DRAFT]: 'default',
  [ATTENDANCE_EVENT_STATUS.UPCOMING]: 'blue',
  [ATTENDANCE_EVENT_STATUS.ACTIVE]: 'green',
  [ATTENDANCE_EVENT_STATUS.COMPLETED]: 'volcano',
  [ATTENDANCE_EVENT_STATUS.CANCELLED]: 'grey',
} as const

// QR 코드 관련 색상 정의
export const ATTENDANCE_QR_COLORS = {
  HIGH: '#1677ff', // 남은 시간이 많을 때
  MEDIUM: '#52c41a', // 남은 시간이 중간일 때
  LOW: '#faad14', // 남은 시간이 적을 때
  EXPIRED: '#ff4d4f', // 만료된 상태
}

// 에러 메시지
export const ATTENDANCE_ERROR_MESSAGES = {
  LOAD_EVENTS_FAILED: '출석체크 목록을 불러오는 중 오류가 발생했습니다.',
  LOAD_EVENT_FAILED: '출석체크 정보를 불러오는 중 오류가 발생했습니다.',
  CREATE_EVENT_FAILED: '출석체크를 생성하는 중 오류가 발생했습니다.',
  UPDATE_EVENT_FAILED: '출석체크를 수정하는 중 오류가 발생했습니다.',
  DELETE_EVENT_FAILED: '출석체크를 삭제하는 중 오류가 발생했습니다.',
  GENERATE_QR_FAILED: 'QR 코드 생성에 실패했습니다.',
  CHECKIN_FAILED: '출석체크에 실패했습니다.',
  LOAD_PARTICIPANTS_FAILED: '참가자 목록을 불러오는 중 오류가 발생했습니다.',
  UPDATE_PARTICIPANT_FAILED: '참가자 상태 업데이트에 실패했습니다.',
  LOAD_STATISTICS_FAILED: '통계 정보를 불러오는 중 오류가 발생했습니다.',
}

// 성공 메시지
export const ATTENDANCE_SUCCESS_MESSAGES = {
  CREATE_EVENT_SUCCESS: '출석체크가 성공적으로 생성되었습니다.',
  UPDATE_EVENT_SUCCESS: '출석체크가 성공적으로 수정되었습니다.',
  DELETE_EVENT_SUCCESS: '출석체크가 성공적으로 삭제되었습니다.',
  CHECKIN_SUCCESS: '출석체크가 완료되었습니다.',
  UPDATE_PARTICIPANT_SUCCESS: '참가자 상태가 업데이트되었습니다.',
}

// 유효성 검사 관련 메시지
export const ATTENDANCE_VALIDATION_MESSAGES = {
  TITLE_REQUIRED: '이벤트명을 입력해주세요',
  DESCRIPTION_REQUIRED: '이벤트 설명을 입력해주세요',
  EVENT_PERIOD_REQUIRED: '이벤트 기간을 선택해주세요',
  LOCATION_REQUIRED: '장소를 입력해주세요',
  MAX_PARTICIPANTS_REQUIRED: '최대 참여자 수를 입력해주세요',
}

// QR 코드 관련 상수
export const ATTENDANCE_QR_CONSTANTS = {
  DEFAULT_VALID_MINUTES: 5,
  MIN_VALID_MINUTES: 1,
  MAX_VALID_MINUTES: 60,
} 