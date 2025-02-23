import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RaffleEvent, RaffleParticipant, RaffleEventFormData } from '../types/raffle'

// Fetch all raffles
export const useRaffles = () => {
  return useQuery<RaffleEvent[]>({
    queryKey: ['raffles'],
    queryFn: async () => {
      const { data } = await axios.get('/api/raffles')
      return data
    }
  })
}

// Fetch raffle details
export const useRaffleDetail = (raffleId: string) => {
  return useQuery<RaffleEvent>({
    queryKey: ['raffle', raffleId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/raffles/${raffleId}`)
      return data
    }
  })
}

// Create a new raffle
export const useCreateRaffle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: RaffleEventFormData) => {
      const newRaffle: RaffleEvent = {
        ...formData,
        id: '', // Generate or assign an ID as needed
        status: 'draft', // Default status
        currentParticipants: 0, // Default value
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        prizes: formData.prizes.map(prize => ({
          ...prize,
          id: '', // Generate or assign an ID as needed
          raffleId: '', // Assign the raffle ID once it's created
        })),
      }
      const { data } = await axios.post<RaffleEvent>('/api/raffles', newRaffle)
      return data
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
      const { data } = await axios.get(`/api/raffles/${raffleId}/winners`)
      return data
    }
  })
}

export const useUpdateRaffle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updateData: { id: string } & RaffleEventFormData) => {
      const updatedRaffle: RaffleEvent = {
        ...updateData,
        status: 'draft', // Use the current status or update as needed
        currentParticipants: 0, // Use the current value or update as needed
        createdAt: new Date().toISOString(), // Use the current value or update as needed
        updatedAt: new Date().toISOString(),
        prizes: updateData.prizes.map(prize => ({
          ...prize,
          id: '', // Generate or assign an ID as needed
          raffleId: updateData.id, // Use the existing raffle ID
        })),
      }
      const { data } = await axios.put<RaffleEvent>(`/api/raffles/${updateData.id}`, updatedRaffle)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raffles'] })
    },
  })
}

// Fetch participants for a specific raffle
export const useRaffleParticipants = (raffleId: string) => {
  return useQuery<RaffleParticipant[]>({
    queryKey: ['raffleParticipants', raffleId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/raffles/${raffleId}/participants`)
      return data
    }
  })
}

export function useDeleteRaffle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (raffleId: string) => {
      await axios.delete(`/api/raffles/${raffleId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raffles'] })
    }
  })
}