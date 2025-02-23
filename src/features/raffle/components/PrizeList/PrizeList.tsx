import styles from './PrizeList.module.css'
import { RafflePrize } from '../../types/raffle'

interface PrizeListProps {
  prizes: RafflePrize[]
}

export function PrizeList({ prizes }: PrizeListProps) {
  return (
    <div className={styles.container}>
      <h2>상품 목록</h2>
      <ul className={styles.list}>
        {prizes.map(prize => (
          <li key={prize.id} className={styles.item}>
            <span>{prize.rank}등: {prize.name}</span> - <span>수량: {prize.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  )
} 