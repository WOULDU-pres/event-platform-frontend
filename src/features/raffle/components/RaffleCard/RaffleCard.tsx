import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import styles from './RaffleCard.module.css'

interface RaffleCardProps {
  raffle: RaffleEvent
  onClick?: () => void
}

export function RaffleCard({ raffle, onClick }: RaffleCardProps) {
  const statusText = {
    draft: '임시저장',
    upcoming: '진행 예정',
    in_progress: '진행 중',
    completed: '종료됨',
    cancelled: '취소됨'
  }

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img 
          src={raffle.imageUrl || '/placeholder-raffle.png'} 
          alt={raffle.title}
          className={styles.image}
        />
        <span className={`${styles.status} ${styles[raffle.status]}`}>
          {statusText[raffle.status]}
        </span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{raffle.title}</h3>
        <p className={styles.description}>{raffle.description}</p>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>응모 기간</span>
            <span className={styles.value}>
              {format(new Date(raffle.startDate), 'MM.dd', { locale: ko })} - 
              {format(new Date(raffle.endDate), 'MM.dd', { locale: ko })}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>추첨일</span>
            <span className={styles.value}>
              {format(new Date(raffle.drawDate), 'MM.dd', { locale: ko })}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>참여 현황</span>
            <span className={styles.value}>
              {raffle.currentParticipants}/{raffle.maxParticipants}명
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 