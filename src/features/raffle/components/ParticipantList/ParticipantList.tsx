import styles from './ParticipantList.module.css'
import { Table } from '../../../../common/components/data-display/Table/Table'
import { useState } from 'react'
import { useRaffleParticipants } from '../../api/raffleApi'

interface RaffleParticipant {
  id: number
  userName: string
  email: string
  phoneNumber: string
  participatedAt: string
  isWinner: boolean
}

// example data
const mockParticipants: RaffleParticipant[] = [
  { id: 1, userName: '홍길동', email: 'hong@example.com', phoneNumber: '010-1234-5678', participatedAt: '2023-10-01T10:00:00Z', isWinner: true },
  { id: 2, userName: '김철수', email: 'kim@example.com', phoneNumber: '010-8765-4321', participatedAt: '2023-10-02T11:00:00Z', isWinner: false },
]

export function ParticipantList({ raffleId }: { raffleId: string }) {
  const [selectedRows, setSelectedRows] = useState<RaffleParticipant[]>([])
  const { data: participants = [], isLoading, error } = useRaffleParticipants(raffleId)

  const columns = [
    { key: 'userName' as keyof RaffleParticipant, header: '이름' },
    { key: 'email' as keyof RaffleParticipant, header: '이메일' },
    { key: 'phoneNumber' as keyof RaffleParticipant, header: '전화번호' },
    { key: 'participatedAt' as keyof RaffleParticipant, header: '참여일', format: (value: string) => new Date(value).toLocaleDateString() },
    { key: 'isWinner' as keyof RaffleParticipant, header: '당첨 여부', format: (value: boolean) => (value ? '당첨' : '미당첨') }
  ]

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading participants</div>

  return (
    <div className={styles.container}>
      <h2>참여자 목록</h2>
      <Table<RaffleParticipant>
        columns={columns}
        // data={participants}
        data={mockParticipants}
        selectable={true}
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
      />
    </div>
  )
} 