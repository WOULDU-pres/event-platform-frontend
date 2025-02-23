import { useNavigate } from 'react-router-dom'
import { RaffleList } from '../../components/RaffleList/RaffleList'
import { useRaffles } from '../../api/raffleApi'
import styles from './RaffleListPage.module.css'

export function RaffleListPage() {
  const navigate = useNavigate()
  const { data: raffles = [], isLoading, error } = useRaffles()

  const handleRaffleClick = (raffleId: string) => {
    navigate(`/raffles/${raffleId}`)
  }

  const handleCreateClick = () => {
    navigate('/raffles/create')
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading raffles</div>

  return (
    <div className={styles.container}>
      <RaffleList 
        raffles={raffles} 
        onRaffleClick={handleRaffleClick} 
        onCreateClick={handleCreateClick} 
      />
    </div>
  )
}