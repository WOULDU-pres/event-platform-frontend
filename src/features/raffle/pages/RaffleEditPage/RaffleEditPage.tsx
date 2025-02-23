import { useNavigate, useParams } from 'react-router-dom'
import { RaffleForm } from '../../components/RaffleForm/RaffleForm'
import { useRaffleDetail, useUpdateRaffle } from '../../api/raffleApi'
import styles from './RaffleEditPage.module.css'
import type { RaffleEventFormData } from '../../types/raffle'

export function RaffleEditPage() {
  const navigate = useNavigate()
  const { raffleId } = useParams<{ raffleId: string }>()
  const { data: raffle, isLoading, error } = useRaffleDetail(raffleId || '')
  const { mutate: updateRaffle } = useUpdateRaffle()

  const handleSubmit = (data: RaffleEventFormData) => {
    if (raffleId) {
      updateRaffle({ id: raffleId, ...data }, {
        onSuccess: () => {
          navigate(`/raffles/${raffleId}`)
        },
        onError: (error) => {
          console.error('Error updating raffle:', error)
        }
      })
    }
  }

  const handleCancel = () => {
    navigate(`/raffles/${raffleId}`)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading raffle details</div>

  return (
    <div className={styles.container}>
      <h2>래플 수정</h2>
      {raffle && (
        <RaffleForm initialData={raffle} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
    </div>
  )
} 