import { create } from 'zustand'

interface RaffleStore {
  selectedRaffleId: string | null
  setSelectedRaffleId: (id: string | null) => void
}

export const useRaffleStore = create<RaffleStore>((set) => ({
  selectedRaffleId: null,
  setSelectedRaffleId: (id) => set({ selectedRaffleId: id })
})) 