import { useState } from 'react'
import { RaffleCard } from '../RaffleCard/RaffleCard'
import { Button } from '../../../../common/components/inputs/Button/Button'
import { Select } from '../../../../common/components/inputs/Select/Select'
import styles from './RaffleList.module.css'
import { RaffleEvent, RaffleStatus } from '../../types/raffle'

interface RaffleListProps {
  raffles: RaffleEvent[]
  onRaffleClick: (raffleId: string) => void
  onCreateClick: () => void
}

export function RaffleList({ 
  raffles = [],
  onRaffleClick, 
  onCreateClick 
}: RaffleListProps) {
  const [status, setStatus] = useState<RaffleStatus | 'all'>('all')
  
  const filteredRaffles = status === 'all' 
    ? raffles 
    : raffles.filter(raffle => raffle.status === status)

  // Debugging logs
  console.log('raffles:', raffles)
  console.log('filteredRaffles:', filteredRaffles)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>래플 이벤트 목록</h2>
        <div className={styles.actions}>
          <Select 
            value={status}
            onChange={(e) => setStatus(e.target.value as RaffleStatus | 'all')}
          >
            <option value="all">전체</option>
            <option value="draft">임시저장</option>
            <option value="upcoming">진행 예정</option>
            <option value="in_progress">진행 중</option>
            <option value="completed">종료됨</option>
            <option value="cancelled">취소됨</option>
          </Select>
          <Button onClick={onCreateClick}>새 래플 만들기</Button>
        </div>
      </div>
      
      {Array.isArray(filteredRaffles) && filteredRaffles.length === 0 ? (
        <div className={styles.empty}>
          <p>등록된 래플 이벤트가 없습니다.</p>
          <Button onClick={onCreateClick}>첫 래플 만들기</Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {Array.isArray(filteredRaffles) && filteredRaffles.map(raffle => (
            <RaffleCard
              key={raffle.id}
              raffle={raffle}
              onClick={() => onRaffleClick(raffle.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 