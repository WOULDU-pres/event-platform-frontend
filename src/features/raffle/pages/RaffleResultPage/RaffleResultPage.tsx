import { useParams } from 'react-router-dom'
import { WinnerList } from '../../components/WinnerList/WinnerList'
import { useRaffleWinners } from '../../api/raffleApi'
import styles from './RaffleResultPage.module.css'

export function RaffleResultPage() {
  const { raffleId } = useParams<{ raffleId: string }>()
  const { data: winners = [], isLoading, error } = useRaffleWinners(raffleId || '')

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading winners</div>

  return (
    <div className={styles.container}>
      <h2>럭키드로우 결과</h2>
      <WinnerList winners={winners} />
    </div>
  )
}