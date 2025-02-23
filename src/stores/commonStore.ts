import { create } from 'zustand'

interface CommonState {
  memberId: string | null
  setMemberId: (id: string) => void
  generateMemberId: () => void
}

const useCommonStore = create<CommonState>((set) => ({
  memberId: localStorage.getItem('memberId'),
  
  setMemberId: (id) => {
    localStorage.setItem('memberId', id)
    set({ memberId: id })
  },
  
  generateMemberId: () => {
    const newId = crypto.randomUUID()
    localStorage.setItem('memberId', newId)
    set({ memberId: newId })
  }
}))

export default useCommonStore
