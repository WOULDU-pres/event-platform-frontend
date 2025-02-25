// 럭키드로우 이벤트 상태
type RaffleStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'


// 당첨자 상태
type WinnerStatus = 'pending' | 'confirmed' | 'declined'

// 럭키드로우 이벤트 기본 정보
interface RaffleEvent {
  id: string
  title: string
  description: string
  imageUrl?: string
  startDate: string
  endDate: string
  drawDate: string
  status: RaffleStatus
  maxParticipants: number
  currentParticipants: number
  numberOfWinners: number
  createdAt: string
  updatedAt: string
  prizes: RafflePrize[]
}

// 럭키드로우 상품 정보
interface RafflePrize {
  id: string
  raffleId: string
  name: string
  description: string
  imageUrl?: string
  quantity: number
  rank: number // 1등, 2등 등의 순위
}

// 참여자 정보
interface RaffleParticipant {
  id: string
  raffleId: string
  userId: string
  userName: string
  email: string
  phoneNumber: string
  entryNumber: string // 추첨번호
  participatedAt: string
  isWinner: boolean
}

// 당첨자 정보
interface RaffleWinner {
  id: string
  raffleId: string
  participantId: string
  prizeId: string
  status: WinnerStatus
  winningDate: string
  claimedDate?: string
}

// 럭키드로우 이벤트 생성 폼 데이터
interface RaffleEventFormData {
  title: string
  description: string
  imageFile?: File
  startDate: string
  endDate: string
  drawDate: string
  maxParticipants: number
  numberOfWinners: number
  prizes: Array<{
    id: string
    name: string
    description: string
    imageFile?: File
    quantity: number
    rank: number
  }>
}

// 럭키드로우 참여 폼 데이터
interface RaffleParticipationFormData {
  userName: string
  email: string
  phoneNumber: string
  agreement: boolean // 개인정보 수집 동의
}

// 럭키드로우 결과 데이터
interface RaffleResult {
  raffleId: string
  drawDate: string
  totalParticipants: number
  winners: Array<{
    rank: number
    prizeName: string
    winner: {
      entryNumber: string
      userName: string
    }
  }>
}

// 럭키드로우 통계 데이터
interface RaffleStatistics {
  totalParticipants: number
  participationRate: number // 참여율 (현재 참여자 / 최대 참여자)
  winnerConfirmationRate: number // 당첨 수락률
  participantsByDate: Array<{
    date: string
    count: number
  }>
}

export type { RaffleStatus, WinnerStatus, RaffleEvent, RafflePrize, RaffleParticipant, RaffleWinner, RaffleEventFormData, RaffleParticipationFormData, RaffleResult, RaffleStatistics }