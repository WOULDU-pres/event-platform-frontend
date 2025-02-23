import { useNavigate } from 'react-router-dom'
import { RaffleForm } from '../../components/RaffleForm/RaffleForm'
import { useCreateRaffle } from '../../api/raffleApi'
import styles from './RaffleCreatePage.module.css'
import type { RaffleEventFormData } from '../../types/raffle'

export function RaffleCreatePage() {
  const navigate = useNavigate()
  const { mutate: createRaffle } = useCreateRaffle()

  const handleSubmit = (data: RaffleEventFormData) => {
    createRaffle(data, {
      onSuccess: () => {
        navigate('/raffles')
      },
      onError: (error) => {
        console.error('Error creating raffle:', error)
      }
    })
  }

  const handleCancel = () => {
    navigate('/raffles')
  }

  return (
    <div className={styles.container}>
      <h2>새 래플 만들기</h2>
      <RaffleForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  )
}