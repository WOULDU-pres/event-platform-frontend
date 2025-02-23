import { useNavigate, useParams } from 'react-router-dom'
import { Spin, message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { RaffleDetail } from '../../components/RaffleDetail/RaffleDetail'
import { useRaffleDetail, useDeleteRaffle } from '../../api/raffleApi'
import styles from './RaffleDetailPage.module.css'

const { confirm } = Modal

export function RaffleDetailPage() {
  const navigate = useNavigate()
  const { raffleId } = useParams<{ raffleId: string }>()
  const { data: raffle, isLoading, error } = useRaffleDetail(raffleId || '')
  const { mutate: deleteRaffle } = useDeleteRaffle()
  const [messageApi, contextHolder] = message.useMessage()

  const handleEdit = () => {
    navigate(`/raffles/${raffleId}/edit`)
  }

  const handleDelete = () => {
    confirm({
      title: '래플을 삭제하시겠습니까?',
      icon: <ExclamationCircleOutlined />,
      content: '이 작업은 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        deleteRaffle(raffleId || '', {
          onSuccess: () => {
            messageApi.success('래플이 삭제되었습니다.')
            navigate('/raffles')
          },
          onError: (error) => {
            console.error('Error deleting raffle:', error)
            messageApi.error('래플 삭제 중 오류가 발생했습니다.')
          }
        })
      }
    })
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
        <RaffleDetail
          raffle={raffle}
          prizes={raffle.prizes || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  )
}