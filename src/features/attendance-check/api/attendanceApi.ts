import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../common/api/core/apiClient'
import { 
  AttendanceEvent, 
  AttendanceParticipant, 
  AttendanceEventFormData, 
  AttendanceEventStatus,
  AttendanceStatus,
  AttendanceQRCode,
  AttendanceStatistics
} from '../types/attendance'

// API 응답 타입 정의
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 날짜 형식 변환 함수
const formatDateForServer = (dateString: string) => {
  if (!dateString) return dateString;
  return dateString.split('+')[0];
}

// 서버에서 받은 날짜를 클라이언트 형식으로 변환
const formatDateFromServer = (dateString: string) => {
  if (!dateString) return dateString;
  return new Date(dateString).toISOString();
}

// 백엔드 상태값을 프론트엔드 상태값으로 매핑
const mapBackendStatus = (status: string): AttendanceEventStatus => {
  const statusMap: Record<string, AttendanceEventStatus> = {
    'ACTIVE': 'ACTIVE',
    'UPCOMING': 'UPCOMING',
    'COMPLETED': 'COMPLETED',
    'CANCELLED': 'CANCELLED',
    'DRAFT': 'DRAFT'
  };
  
  return statusMap[status] || 'ACTIVE';
}

// 모든 출석체크 이벤트 가져오기
export const useAttendanceEvents = () => {
  return useQuery<AttendanceEvent[]>({
    queryKey: ['attendanceEvents'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ content: AttendanceEvent[] }>>('/attendance-events')
      
      if (response.data.success && response.data.data) {
        const eventsData = response.data.data.content || [];
        
        return eventsData.map((event: AttendanceEvent) => ({
          ...event,
          status: mapBackendStatus(event.status),
          startDate: formatDateFromServer(event.startDate),
          endDate: formatDateFromServer(event.endDate),
          createdAt: formatDateFromServer(event.createdAt),
          updatedAt: formatDateFromServer(event.updatedAt)
        }));
      }
      
      console.error('API Error:', response.data.message || '데이터를 불러오는데 실패했습니다');
      return [];
    }
  })
}

// 단일 출석체크 이벤트 상세 정보 가져오기
export const useAttendanceEventDetail = (eventId: string) => {
  return useQuery<AttendanceEvent>({
    queryKey: ['attendanceEvent', eventId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceEvent>>(`/attendance-events/${eventId}`)
      
      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          status: mapBackendStatus(response.data.data.status),
          startDate: formatDateFromServer(response.data.data.startDate),
          endDate: formatDateFromServer(response.data.data.endDate),
          createdAt: formatDateFromServer(response.data.data.createdAt),
          updatedAt: formatDateFromServer(response.data.data.updatedAt)
        };
      }
      
      throw new Error(response.data.message || '출석체크 이벤트를 불러오는데 실패했습니다');
    },
    enabled: !!eventId
  })
}

// 새 출석체크 이벤트 생성
export const useCreateAttendanceEvent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: AttendanceEventFormData) => {
      // 파일 업로드 처리
      let imageUrl: string | undefined = undefined;
      
      if (formData.imageUrl) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.imageUrl);
        
        const uploadResponse = await apiClient.post<ApiResponse<{ url: string }>>('/upload', uploadFormData);
        
        if (uploadResponse.data.success && uploadResponse.data.data) {
          imageUrl = uploadResponse.data.data.url;
        }
      }
      
      // 이벤트 생성
      const now = new Date();
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      let status: AttendanceEventStatus;
      if (now < startDate) {
        status = 'UPCOMING';
      } else if (now >= startDate && now <= endDate) {
        status = 'ACTIVE';
      } else {
        status = 'COMPLETED';
      }
      
      const eventData = {
        title: formData.title,
        description: formData.description,
        imageUrl,
        startDate: formatDateForServer(formData.startDate),
        endDate: formatDateForServer(formData.endDate),
        location: formData.location,
        maxParticipants: formData.maxParticipants,
        currentParticipants: 0,
        status,
        qrCodeEnabled: formData.qrCodeEnabled,
        qrCodeValidMinutes: formData.qrCodeValidMinutes,
        createdAt: formatDateForServer(new Date().toISOString()),
        updatedAt: formatDateForServer(new Date().toISOString())
      };
      
      const response = await apiClient.post<ApiResponse<AttendanceEvent>>('/attendance-events', eventData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || '출석체크 이벤트 생성에 실패했습니다');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceEvents'] })
    }
  })
}

// QR 코드 생성
export const useGenerateQRCode = () => {
  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await apiClient.post<ApiResponse<AttendanceQRCode>>(`/attendance-events/${eventId}/qrcode`);
      
      if (response.data.success && response.data.data) {
        return {
          ...response.data.data,
          expiresAt: formatDateFromServer(response.data.data.expiresAt),
          createdAt: formatDateFromServer(response.data.data.createdAt)
        };
      }
      
      throw new Error(response.data.message || 'QR 코드 생성에 실패했습니다');
    }
  })
}

// QR 코드로 출석 체크
export const useCheckInWithQRCode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ 
      code, 
      participantId 
    }: { 
      code: string; 
      participantId: string 
    }) => {
      const response = await apiClient.post<ApiResponse<AttendanceParticipant>>(
        `/attendance-checkin/qr`, 
        { code, participantId }
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || '출석 체크에 실패했습니다');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendanceEvent', data.eventId] })
      queryClient.invalidateQueries({ queryKey: ['attendanceParticipants', data.eventId] })
    }
  })
}

// 참석자 상태 업데이트
export const useUpdateParticipantStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ 
      participantId, 
      eventId, 
      status, 
      notes 
    }: { 
      participantId: string;
      eventId: string;
      status: AttendanceStatus;
      notes?: string;
    }) => {
      const response = await apiClient.patch<ApiResponse<AttendanceParticipant>>(
        `/attendance-events/${eventId}/participants/${participantId}`,
        { status, notes }
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || '참석자 상태 업데이트에 실패했습니다');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendanceParticipants', data.eventId] })
      queryClient.invalidateQueries({ queryKey: ['attendanceEvent', data.eventId] })
    }
  })
}

// 통계 데이터 가져오기
export const useAttendanceStatistics = (eventId: string) => {
  return useQuery<AttendanceStatistics>({
    queryKey: ['attendanceStatistics', eventId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceStatistics>>(
        `/attendance-events/${eventId}/statistics`
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || '통계 정보를 가져오는데 실패했습니다');
    },
    enabled: !!eventId
  });
}

// 모든 출석체크 이벤트 필터링 (검색 기능)
export const useSearchAttendanceEvents = (searchTerm: string) => {
  return useQuery<AttendanceEvent[]>({
    queryKey: ['attendanceEvents', 'search', searchTerm],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceEvent[]>>(
        `/attendance-events/search?term=${encodeURIComponent(searchTerm)}`
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || '출석체크 검색에 실패했습니다');
    },
    enabled: searchTerm.length > 0
  });
}

// 자주 사용되는 출석체크 이벤트 조회 (최근에 생성된, 가장 많이 참여한 등)
export const useFeaturedAttendanceEvents = (type: 'recent' | 'popular' | 'upcoming', limit: number = 5) => {
  return useQuery<AttendanceEvent[]>({
    queryKey: ['attendanceEvents', 'featured', type, limit],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceEvent[]>>(
        `/attendance-events/featured?type=${type}&limit=${limit}`
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || '추천 출석체크 이벤트를 가져오는데 실패했습니다');
    }
  });
}

// 이벤트 참가자 목록 가져오기
export const useAttendanceParticipants = (eventId: string) => {
  return useQuery<AttendanceParticipant[]>({
    queryKey: ['attendanceParticipants', eventId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AttendanceParticipant[]>>(
        `/attendance-events/${eventId}/participants`
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || '참가자 목록을 가져오는데 실패했습니다');
    },
    enabled: !!eventId
  });
}

// 이벤트 삭제하기
export const useDeleteAttendanceEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await apiClient.delete<ApiResponse<boolean>>(
        `/attendance-events/${eventId}`
      );
      
      if (response.data.success) {
        return true;
      }
      
      throw new Error(response.data.message || '이벤트 삭제에 실패했습니다');
    },
    onSuccess: (_, eventId) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['attendanceEvents']
      });
      queryClient.invalidateQueries({
        queryKey: ['attendanceEvent', eventId]
      });
      queryClient.invalidateQueries({
        queryKey: ['attendanceParticipants', eventId]
      });
      queryClient.invalidateQueries({
        queryKey: ['attendanceStatistics', eventId]
      });
    }
  });
}

// 이벤트 업데이트하기
export const useUpdateAttendanceEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      eventId,
      data
    }: {
      eventId: string;
      data: Partial<AttendanceEventFormData>;
    }) => {
      const response = await apiClient.put<ApiResponse<AttendanceEvent>>(
        `/attendance-events/${eventId}`,
        data
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || '이벤트 수정에 실패했습니다');
    },
    onSuccess: (updatedEvent) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['attendanceEvents']
      });
      queryClient.invalidateQueries({
        queryKey: ['attendanceEvent', updatedEvent.id]
      });
    }
  });
} 