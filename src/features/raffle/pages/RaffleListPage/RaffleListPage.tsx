import { useNavigate } from 'react-router-dom'
import { Spin, message } from 'antd'
import { RaffleList } from '../../components/RaffleList/RaffleList'
import { useRaffles } from '../../api/raffleApi'
import styles from './RaffleListPage.module.css'
import type { RaffleStatus } from '../../types/raffle'

export function RaffleListPage() {
  const navigate = useNavigate()
  const { data: raffles, isLoading, error } = useRaffles()
  const [messageApi, contextHolder] = message.useMessage()

  const handleRaffleClick = (id: string) => {
    navigate(`/raffles/${id}`)
  }

  const handleCreateClick = () => {
    navigate('/raffles/create')
  }

  const handleStatusChange = (status: RaffleStatus | 'all') => {
    // 상태 필터링 로직 구현
    console.log('Status changed:', status)
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    messageApi.error('래플 목록을 불러오는 중 오류가 발생했습니다.')
    return (
      <div className={styles.errorContainer}>
        <p>래플 목록을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <RaffleList
          raffles={raffles || []}
          onRaffleClick={handleRaffleClick}
          onCreateClick={handleCreateClick}
          onStatusChange={handleStatusChange}
        />
      </div>
    </>
  )
}