import { useNavigate } from 'react-router-dom'
import { Card, Typography, message } from 'antd'
import { RaffleForm } from '../../components/RaffleForm/RaffleForm'
import { useCreateRaffle } from '../../api/raffleApi'
import styles from './RaffleCreatePage.module.css'
import type { RaffleEventFormData } from '../../types/raffle'

const { Title } = Typography

export function RaffleCreatePage() {
  const navigate = useNavigate()
  const { mutate: createRaffle } = useCreateRaffle()
  const [messageApi, contextHolder] = message.useMessage()

  const handleSubmit = (data: RaffleEventFormData) => {
    createRaffle(data, {
      onSuccess: () => {
        messageApi.success('럭키드로우이 성공적으로 생성되었습니다.')
        navigate('/raffles')
      },
      onError: (error) => {
        console.error('Error creating raffle:', error)
        messageApi.error('럭키드로우 생성 중 오류가 발생했습니다.')
      }
    })
  }

  const handleCancel = () => {
    navigate('/raffles')
  }

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2}>새 럭키드로우 만들기</Title>
          <RaffleForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </Card>
      </div>
    </>
  )
}