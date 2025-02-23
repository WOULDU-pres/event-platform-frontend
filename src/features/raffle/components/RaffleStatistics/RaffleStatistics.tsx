import styles from './RaffleStatistics.module.css'
import type { RaffleStatistics } from '../../types/raffle'

interface RaffleStatisticsProps {
  statistics: RaffleStatistics
}

export function RaffleStatistics({ statistics }: RaffleStatisticsProps) {
  return (
    <div className={styles.container}>
      <h2>래플 통계</h2>
      <div className={styles.statItem}>
        <span>총 참여자 수:</span>
        <span>{statistics.totalParticipants}</span>
      </div>
      <div className={styles.statItem}>
        <span>참여율:</span>
        <span>{(statistics.participationRate * 100).toFixed(2)}%</span>
      </div>
      <div className={styles.statItem}>
        <span>당첨 수락률:</span>
        <span>{(statistics.winnerConfirmationRate * 100).toFixed(2)}%</span>
      </div>
    </div>
  )
} 