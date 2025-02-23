declare global {
    // API 응답 공통 형식
    interface ApiResponse<T> {
      data: T
      timestamp: string
      status: number
    }
  
    // 에러 응답 형식
    interface ErrorResponse {
      code: string
      message: string
      details?: Record<string, string[]>
    }
    
    // 이벤트 기본 타입
    interface BaseEvent {
      id: string
      title: string
      startDate: string
      endDate: string
    }
  }
  