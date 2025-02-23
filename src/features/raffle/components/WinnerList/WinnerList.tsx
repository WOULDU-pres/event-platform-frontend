import styles from './WinnerList.module.css'
import { RaffleParticipant } from '../../types/raffle'

interface WinnerListProps {
  winners: RaffleParticipant[]
}

export function WinnerList({ winners }: WinnerListProps) {
  return (
    <div className={styles.container}>
      <h2>당첨자 목록</h2>
      <ul className={styles.list}>
        {winners.map(winner => (
          <li key={winner.id} className={styles.item}>
            <span>{winner.userName}</span> - <span>{winner.email}</span>
          </li>
        ))}
      </ul>
    </div>
  )
} 