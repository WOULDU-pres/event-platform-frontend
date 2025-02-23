import { useNavigate, useParams } from 'react-router-dom'
import { Spin, message, Card, Typography } from 'antd'
import { RaffleForm } from '../../components/RaffleForm/RaffleForm'
import { useRaffleDetail, useUpdateRaffle } from '../../api/raffleApi'
import styles from './RaffleEditPage.module.css'
import type { RaffleEventFormData } from '../../types/raffle'

const { Title } = Typography

export function RaffleEditPage() {
  const navigate = useNavigate()
  const { raffleId } = useParams<{ raffleId: string }>()
  const { data: raffle, isLoading, error } = useRaffleDetail(raffleId || '')
  const { mutate: updateRaffle } = useUpdateRaffle()
  const [messageApi, contextHolder] = message.useMessage()

  const handleSubmit = (data: RaffleEventFormData) => {
    if (raffleId) {
      updateRaffle({ id: raffleId, ...data }, {
        onSuccess: () => {
          messageApi.success('래플이 성공적으로 수정되었습니다.')
          navigate(`/raffles/${raffleId}`)
        },
        onError: (error) => {
          console.error('Error updating raffle:', error)
          messageApi.error('래플 수정 중 오류가 발생했습니다.')
        }
      })
    }
  }

  const handleCancel = () => {
    navigate(`/raffles/${raffleId}`)
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }

  if (error || !raffle) {
    return (
      <div className={styles.errorContainer}>
        <p>래플 정보를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2}>래플 수정</Title>
          <RaffleForm 
            initialData={raffle} 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
          />
        </Card>
      </div>
    </>
  )
} 