import { useNavigate, useParams } from 'react-router-dom'
import { Spin, message, Modal, Layout } from 'antd'
import { RaffleDetail } from '../../components/RaffleDetail/RaffleDetail'
import { useRaffleDetail, useDeleteRaffle } from '../../api/raffleApi'
import { Header } from '../../../../common/components/layout/Header/Header'
import styles from './RaffleDetailPage.module.css'
import { useState } from 'react'

const { Content } = Layout

export function RaffleDetailPage() {
  const navigate = useNavigate()
  const { raffleId } = useParams<{ raffleId: string }>()
  const { data: raffle, isLoading, error } = useRaffleDetail(raffleId || '')
  const { mutate: deleteRaffle, isPending: isDeleting } = useDeleteRaffle()
  const [messageApi, contextHolder] = message.useMessage()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleEdit = () => {
    navigate(`/raffles/${raffleId}/edit`)
  }

  const confirmDelete = () => {
    if (!raffleId) {
      console.error('raffleId가 없습니다');
      return;
    }
    
    console.log('삭제 확인 클릭');
    deleteRaffle(raffleId, {
      onSuccess: () => {
        console.log('삭제 성공 콜백');
        messageApi.success('럭키드로우이 성공적으로 삭제되었습니다.');
        navigate('/raffles');
      },
      onError: (error) => {
        console.error('삭제 실패 콜백:', error);
        messageApi.error('럭키드로우 삭제 중 오류가 발생했습니다.');
      }
    });
  };

  const handleDelete = () => {
    if (!raffleId) {
      console.error('raffleId가 없습니다');
      return;
    }
    
    console.log('삭제 버튼 클릭:', raffleId);
    setIsDeleteModalOpen(true);
  }

  const handleModalCancel = () => {
    console.log('삭제 취소');
    setIsDeleteModalOpen(false);
  }

  const handleModalConfirm = () => {
    console.log('모달 확인 클릭');
    setIsDeleteModalOpen(false);
    confirmDelete();
  }

  if (isLoading || isDeleting) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip={isDeleting ? "삭제 중..." : "로딩 중..."} />
      </div>
    )
  }

  if (error || !raffle) {
    return (
      <div className={styles.errorContainer}>
        <p>럭키드로우 정보를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <Layout className={styles.layout}>
      {contextHolder}
      <Header />
      <Content className={styles.content}>
        <div className={styles.container}>
          <RaffleDetail
            raffle={raffle}
            prizes={raffle.prizes || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          <Modal
            title="럭키드로우 삭제"
            open={isDeleteModalOpen}
            onOk={handleModalConfirm}
            onCancel={handleModalCancel}
            okText="삭제"
            cancelText="취소"
            okButtonProps={{ danger: true }}
          >
            <p>럭키드로우을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          </Modal>
        </div>
      </Content>
    </Layout>
  )
}