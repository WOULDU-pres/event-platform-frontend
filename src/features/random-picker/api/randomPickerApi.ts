import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../common/api/core/apiClient'
import { PickerConfig, PickerFormData, PickerResult, PickerStatus } from '../types/picker'

// API 응답 타입 정의
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// 날짜 형식 변환 함수
const formatDateFromServer = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  return dateStr;
}

const formatDateForServer = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  return dateStr;
}

// 백엔드 상태값을 프론트엔드 상태값으로 매핑
const mapBackendStatus = (status: string): PickerStatus => {
  // 상태값 매핑 로직 (대소문자 등)
  return status as PickerStatus;
}

// Fetch all pickers
export const usePickers = () => {
  return useQuery<PickerConfig[]>({
    queryKey: ['pickers'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ content: PickerConfig[] }>>('/pickers')
      
      // 백엔드 응답 구조 처리
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        const pickerData = responseData.data.content || [];
        
        // 서버에서 받은 데이터 변환
        return pickerData.map((picker: PickerConfig) => ({
          ...picker,
          status: mapBackendStatus(picker.status),
          createdAt: formatDateFromServer(picker.createdAt),
          updatedAt: formatDateFromServer(picker.updatedAt)
        }));
      }
      
      console.error('API Error:', responseData.message || '데이터를 불러오는데 실패했습니다');
      return [];
    }
  })
}

// Fetch picker details
export const usePickerDetail = (pickerId: string) => {
  return useQuery<PickerConfig>({
    queryKey: ['picker', pickerId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PickerConfig>>(`/pickers/${pickerId}`)
      
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        return {
          ...responseData.data,
          status: mapBackendStatus(responseData.data.status),
          createdAt: formatDateFromServer(responseData.data.createdAt),
          updatedAt: formatDateFromServer(responseData.data.updatedAt)
        };
      }
      
      throw new Error(responseData.message || 'Random Picker 정보를 불러오는데 실패했습니다');
    },
    enabled: !!pickerId
  })
}

// Create a new picker
export const useCreatePicker = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: PickerFormData) => {
      // 항목 문자열을 배열로 변환
      const itemsArray = typeof formData.items === 'string' 
        ? formData.items.split('\n').map(item => item.trim()).filter(item => item.length > 0).map(content => ({
          id: '',
          content,
          weight: 1 // 기본 가중치
        }))
        : formData.items;
        
      const newPicker: PickerConfig = {
        id: '',
        title: formData.title,
        description: formData.description,
        items: itemsArray,
        pickCount: formData.pickCount,
        allowDuplicates: formData.allowDuplicates,
        status: 'SAVED',
        createdAt: formatDateForServer(new Date().toISOString()),
        updatedAt: formatDateForServer(new Date().toISOString())
      }
      
      const response = await apiClient.post<ApiResponse<PickerConfig>>('/pickers', newPicker)
      
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      
      throw new Error(responseData.message || 'Random Picker 생성에 실패했습니다');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickers'] })
    }
  })
}

// Update an existing picker
export const useUpdatePicker = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...formData }: PickerFormData & { id: string }) => {
      // 항목 문자열을 배열로 변환
      const itemsArray = typeof formData.items === 'string' 
        ? formData.items.split('\n').map(item => item.trim()).filter(item => item.length > 0).map(content => ({
          id: '',
          content,
          weight: 1 // 기본 가중치
        }))
        : formData.items;
        
      const updateData = {
        title: formData.title,
        description: formData.description,
        items: itemsArray,
        pickCount: formData.pickCount,
        allowDuplicates: formData.allowDuplicates,
      }
      
      const response = await apiClient.put<ApiResponse<PickerConfig>>(`/pickers/${id}`, updateData)
      
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      
      throw new Error(responseData.message || 'Random Picker 수정에 실패했습니다');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pickers'] })
      queryClient.invalidateQueries({ queryKey: ['picker', variables.id] })
    }
  })
}

// Delete a picker
export const useDeletePicker = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (pickerId: string) => {
      const response = await apiClient.delete<ApiResponse<boolean>>(`/pickers/${pickerId}`)
      
      const responseData = response.data;
      
      if (responseData.success) {
        return true;
      }
      
      throw new Error(responseData.message || 'Random Picker 삭제에 실패했습니다');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickers'] })
    }
  })
}

// Execute picker and get results
export const usePickerExecute = () => {
  return useMutation({
    mutationFn: async ({ pickerId, pickCount, allowDuplicates }: { 
      pickerId: string, 
      pickCount: number, 
      allowDuplicates: boolean 
    }) => {
      const response = await apiClient.post<ApiResponse<PickerResult>>(
        `/pickers/${pickerId}/execute`, 
        { pickCount, allowDuplicates }
      )
      
      const responseData = response.data;
      
      if (responseData.success && responseData.data) {
        return responseData.data;
      }
      
      throw new Error(responseData.message || '랜덤 선택 실행에 실패했습니다');
    }
  })
} 