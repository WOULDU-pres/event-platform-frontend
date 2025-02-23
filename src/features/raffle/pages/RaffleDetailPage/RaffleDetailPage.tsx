import { useNavigate, useParams } from 'react-router-dom'
import { RaffleDetail } from '../../components/RaffleDetail/RaffleDetail'
import { useRaffleDetail } from '../../api/raffleApi'
import styles from './RaffleDetailPage.module.css'

export function RaffleDetailPage() {
  const navigate = useNavigate()
  const { raffleId } = useParams<{ raffleId: string }>()
  const { data: raffle, isLoading, error } = useRaffleDetail(raffleId || '')

  const handleEdit = () => {
    navigate(`/raffles/${raffleId}/edit`)
  }

  const handleDelete = () => {
    // Implement deletion logic here
    // After deletion, navigate back to the list
    navigate('/raffles')
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading raffle details</div>

  return (
    <div className={styles.container}>
      {raffle && (
        <RaffleDetail 
          raffle={raffle} 
          prizes={raffle.prizes} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </div>
  )
}