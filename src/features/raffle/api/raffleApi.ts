import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../common/api/core/apiClient'
import { RaffleEvent, RaffleParticipant, RaffleEventFormData, RaffleStatus } from '../types/raffle'

// API 응답 타입 정의
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 날짜 형식 변환 함수
const formatDateForServer = (dateString: string) => {
  if (!dateString) return dateString;
  // ISO 형식에서 타임존 정보를 제거하고 서버 형식으로 변환
  return dateString.split('+')[0]; // "2025-02-28T00:00:00"
}

// 서버에서 받은 날짜를 클라이언트 형식으로 변환
const formatDateFromServer = (dateString: string) => {
  if (!dateString) return dateString;
  return new Date(dateString).toISOString();
}

// 백엔드 상태값을 프론트엔드 상태값으로 매핑
const mapBackendStatus = (status: string): RaffleStatus => {
  const statusMap: Record<string, RaffleStatus> = {
    'ACTIVE': 'ACTIVE',
    'UPCOMING': 'UPCOMING',
    'COMPLETED': 'COMPLETED',
    'CANCELLED': 'CANCELLED',
    'DRAFT': 'DRAFT'
  };
  
  return statusMap[status] || 'ACTIVE';
}

// Fetch all raffles
export const useRaffles = () => {
  return useQuery<RaffleEvent[]>({
    queryKey: ['raffles'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ content: RaffleEvent[] }>>('/raffles')
      
      // 백엔드 응답 구조 처리
      const responseData = response.data;
      
      // success가 true이고 data가 존재하는지 확인
      if (responseData.success && responseData.data) {
        const raffleData = responseData.data.content || [];
        
        // 서버에서 받은 데이터의 날짜 형식 변환
        return raffleData.map((raffle: RaffleEvent) => ({
          ...raffle,
          // 백엔드 상태를 프론트엔드 상태 값으로 변환
          status: mapBackendStatus(raffle.status),
          startDate: formatDateFromServer(raffle.startDate),
          endDate: formatDateFromServer(raffle.endDate),
          drawDate: formatDateFromServer(raffle.drawDate),
          createdAt: formatDateFromServer(raffle.createdAt),
          updatedAt: formatDateFromServer(raffle.updatedAt)
        }));
      }
      
      // 에러가 있거나 데이터가 없는 경우
      console.error('API Error:', responseData.message || '데이터를 불러오는데 실패했습니다');
      return [];
    }
  })
}

// Fetch raffle details
export const useRaffleDetail = (raffleId: string) => {
  return useQuery<RaffleEvent>({
    queryKey: ['raffle', raffleId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<RaffleEvent>>(`/raffles/${raffleId}`)
      
      // 백엔드 응답 구조 처리
      const responseData = response.data;
      
      // success가 true이고 data가 존재하는지 확인
      if (responseData.success && responseData.data) {
        // 서버에서 받은 데이터의 날짜 형식 변환
        return {
          ...responseData.data,
          status: mapBackendStatus(responseData.data.status),
          startDate: formatDateFromServer(responseData.data.startDate),
          endDate: formatDateFromServer(responseData.data.endDate),
          drawDate: formatDateFromServer(responseData.data.drawDate),
          createdAt: formatDateFromServer(responseData.data.createdAt),
          updatedAt: formatDateFromServer(responseData.data.updatedAt)
        };
      }
      
      // 에러가 있거나 데이터가 없는 경우
      throw new Error(responseData.message || '럭키드로우 정보를 불러오는데 실패했습니다');
    },
    enabled: !!raffleId // raffleId가 있을 때만 쿼리 실행
  })
}

// Create a new raffle
export const useCreateRaffle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: RaffleEventFormData) => {
      const newRaffle: RaffleEvent = {
        ...formData,
        // 날짜 형식 변환
        startDate: formatDateForServer(formData.startDate),
        endDate: formatDateForServer(formData.endDate),
        drawDate: formatDateForServer(formData.drawDate),
        id: '', // Generate or assign an ID as needed
        status: 'DRAFT', // 대문자로 수정 (백엔드 상태값과 일치)
        currentParticipants: 0, // Default value
        createdAt: formatDateForServer(new Date().toISOString()),
        updatedAt: formatDateForServer(new Date().toISOString()),
        prizes: formData.prizes.map(prize => ({
          ...prize,
          id: '', // Generate or assign an ID as needed
          raffleId: '', // Assign the raffle ID once it's created
        })),
      }
      
      const response = await apiClient.post<ApiResponse<RaffleEvent>>('/raffles', newRaffle)
      
      // 백엔드 응답 구조 처리
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      
      throw new Error(responseData.message || '럭키드로우 생성에 실패했습니다');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raffles'] })
    },
  })
}

// Fetch raffle winners
export const useRaffleWinners = (raffleId: string) => {
  return useQuery<RaffleParticipant[]>({
    queryKey: ['raffleWinners', raffleId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<RaffleParticipant[]>>(`/raffles/${raffleId}/winners`)
      
      // 백엔드 응답 구조 처리
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      
      throw new Error(responseData.message || '당첨자 정보를 불러오는데 실패했습니다');
    },
    enabled: !!raffleId // raffleId가 있을 때만 쿼리 실행
  })
}

// Update an existing raffle
export const useUpdateRaffle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updateData: { id: string } & RaffleEventFormData) => {
      // 기존 럭키드로우 데이터 가져오기 (현재 참여자 수와 생성일 유지를 위해)
      const existingRaffleResponse = await apiClient.get<ApiResponse<RaffleEvent>>(`/raffles/${updateData.id}`);
      const existingRaffle = existingRaffleResponse.data.success ? existingRaffleResponse.data.data : null;
      
      // 날짜에 따른 상태 결정
      const now = new Date();
      const startDate = new Date(updateData.startDate);
      const endDate = new Date(updateData.endDate);
      
      let status: RaffleStatus;
      if (now < startDate) {
        status = 'UPCOMING';
      } else if (now >= startDate && now <= endDate) {
        status = 'ACTIVE';
      } else {
        status = 'COMPLETED';
      }
      
      const updatedRaffle: RaffleEvent = {
        ...updateData,
        // 날짜 형식 변환
        startDate: formatDateForServer(updateData.startDate),
        endDate: formatDateForServer(updateData.endDate),
        drawDate: formatDateForServer(updateData.drawDate),
        status: status,
        currentParticipants: existingRaffle?.currentParticipants || 0,
        createdAt: existingRaffle?.createdAt || formatDateForServer(new Date().toISOString()),
        updatedAt: formatDateForServer(new Date().toISOString()),
        prizes: updateData.prizes.map(prize => ({
          ...prize,
          id: prize.id || '',
          raffleId: updateData.id, 
        })),
      }
      
      const response = await apiClient.put<ApiResponse<RaffleEvent>>(`/raffles/${updateData.id}`, updatedRaffle)
      
      // 백엔드 응답 구조 처리
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      
      throw new Error(responseData.message || '럭키드로우 수정에 실패했습니다');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['raffles'] })
      queryClient.invalidateQueries({ queryKey: ['raffle', variables.id] })
    },
  })
}

// Fetch participants for a specific raffle
export const useRaffleParticipants = (raffleId: string) => {
  return useQuery<RaffleParticipant[]>({
    queryKey: ['raffleParticipants', raffleId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<RaffleParticipant[]>>(`/raffles/${raffleId}/participants`)
      
      // 백엔드 응답 구조 처리
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      
      throw new Error(responseData.message || '참가자 정보를 불러오는데 실패했습니다');
    },
    enabled: !!raffleId // raffleId가 있을 때만 쿼리 실행
  })
}

// Delete a raffle
export const useDeleteRaffle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (raffleId: string) => {
      console.log('API 호출 시작: DELETE /raffles/' + raffleId);
      try {
        const response = await apiClient.delete<ApiResponse<boolean>>(`/raffles/${raffleId}`);
        const responseData = response.data;
        if (responseData.success) {
          return true;
        }
        throw new Error(responseData.message || '럭키드로우 삭제에 실패했습니다');
      } catch (error) {
        console.error('삭제 오류:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      console.log('삭제 성공 후처리:', variables);
      queryClient.invalidateQueries({ queryKey: ['raffles'] });
      queryClient.removeQueries({ queryKey: ['raffle', variables] });
    },
    onError: (error) => {
      console.error('삭제 뮤테이션 오류:', error);
    }
  })
}