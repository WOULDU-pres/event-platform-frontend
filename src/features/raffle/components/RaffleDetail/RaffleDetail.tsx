import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '../../../../common/components/inputs/Button/Button'
import styles from './RaffleDetail.module.css'

interface RaffleDetailProps {
  raffle: RaffleEvent
  prizes: RafflePrize[]
  onEdit?: () => void
  onDelete?: () => void
}

export function RaffleDetail({ 
  raffle, 
  prizes,
  onEdit,
  onDelete
}: RaffleDetailProps) {
  const statusText = {
    draft: '임시저장',
    upcoming: '진행 예정',
    in_progress: '진행 중',
    completed: '종료됨',
    cancelled: '취소됨'
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={`${styles.status} ${styles[raffle.status]}`}>
            {statusText[raffle.status]}
          </span>
          <h1 className={styles.title}>{raffle.title}</h1>
          <p className={styles.description}>{raffle.description}</p>
        </div>
        {(onEdit || onDelete) && (
          <div className={styles.actions}>
            {onEdit && (
              <Button variant="outline" onClick={onEdit}>
                수정
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" onClick={onDelete}>
                삭제
              </Button>
            )}
          </div>
        )}
      </div>

      <div className={styles.imageWrapper}>
        <img 
          src={raffle.imageUrl || '/placeholder-raffle.png'} 
          alt={raffle.title}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.label}>응모 기간</span>
          <span className={styles.value}>
            {format(new Date(raffle.startDate), 'yyyy.MM.dd HH:mm', { locale: ko })} - 
            {format(new Date(raffle.endDate), 'yyyy.MM.dd HH:mm', { locale: ko })}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>추첨일</span>
          <span className={styles.value}>
            {format(new Date(raffle.drawDate), 'yyyy.MM.dd HH:mm', { locale: ko })}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>참여 현황</span>
          <span className={styles.value}>
            {raffle.currentParticipants}/{raffle.maxParticipants}명
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>당첨자 수</span>
          <span className={styles.value}>{raffle.numberOfWinners}명</span>
        </div>
      </div>

      <div className={styles.prizes}>
        <h2>경품 정보</h2>
        <div className={styles.prizeList}>
          {prizes.map(prize => (
            <div key={prize.id} className={styles.prizeItem}>
              {prize.imageUrl && (
                <img 
                  src={prize.imageUrl} 
                  alt={prize.name} 
                  className={styles.prizeImage}
                />
              )}
              <div className={styles.prizeInfo}>
                <span className={styles.prizeRank}>{prize.rank}등</span>
                <h3 className={styles.prizeName}>{prize.name}</h3>
                <p className={styles.prizeDescription}>{prize.description}</p>
                <span className={styles.prizeQuantity}>수량: {prize.quantity}개</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 