import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Typography, 
  Button, 
  Tag, 
  Spin, 
  message, 
  Space, 
  Modal, 
  Divider,
  List,
  Empty
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlayCircleOutlined
} from '@ant-design/icons'
import { 
  usePickerDetail, 
  useDeletePicker, 
  usePickerExecute 
} from '../../api/randomPickerApi'
import { PickerHistory } from '../../components/PickerHistory/PickerHistory'
import { PickerResult } from '../../components/PickerResult/PickerResult'
import { PickerItem } from '../../types/picker'
import { getStatusText, getStatusTagColor, resultToClipboardText } from '../../util/pickerUtils'
import styles from './PickerDetailPage.module.css'

const { Title, Paragraph, Text } = Typography

export function PickerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [pickedItems, setPickedItems] = useState<PickerItem[]>([])
  
  // API 호출
  const { 
    data: picker, 
    isLoading, 
    isError, 
    error 
  } = usePickerDetail(id || '')
  
  const { mutate: deletePicker } = useDeletePicker()
  const { mutate: executePicker, isPending: isExecuteLoading } = usePickerExecute()
  
  // 에러 처리
  useEffect(() => {
    if (isError && error) {
      messageApi.error('랜덤 뽑기 정보를 불러오는 중 오류가 발생했습니다.')
    }
  }, [isError, error, messageApi])
  
  // 수정 페이지로 이동
  const handleEdit = () => {
    navigate(`/random-picker/${id}/edit`)
  }
  
  // 삭제 모달 표시
  const showDeleteConfirm = () => {
    setShowDeleteModal(true)
  }
  
  // 삭제 처리
  const handleDelete = () => {
    if (!id) return
    
    deletePicker(id, {
      onSuccess: () => {
        messageApi.success('랜덤 뽑기가 삭제되었습니다.')
        navigate('/random-picker')
      },
      onError: () => {
        messageApi.error('랜덤 뽑기 삭제 중 오류가 발생했습니다.')
      },
      onSettled: () => {
        setShowDeleteModal(false)
      }
    })
  }
  
  // 랜덤 선택 실행
  const handleExecute = () => {
    if (!id || !picker) return
    
    setIsExecuting(true)
    setPickedItems([])
    
    executePicker({
      pickerId: id,
      pickCount: picker.pickCount,
      allowDuplicates: picker.allowDuplicates
    }, {
      onSuccess: (result) => {
        setPickedItems(result.pickedItems)
        messageApi.success('랜덤 선택이 완료되었습니다.')
      },
      onError: () => {
        messageApi.error('랜덤 선택 실행 중 오류가 발생했습니다.')
      },
      onSettled: () => {
        setIsExecuting(false)
      }
    })
  }
  
  // 결과 복사
  const handleCopyResult = () => {
    if (pickedItems.length === 0) return
    
    const text = resultToClipboardText(pickedItems)
    navigator.clipboard.writeText(text)
      .then(() => {
        messageApi.success('결과가 클립보드에 복사되었습니다.')
      })
      .catch(() => {
        messageApi.error('클립보드 복사에 실패했습니다.')
      })
  }
  
  // 결과 저장
  const handleSaveResult = () => {
    if (pickedItems.length === 0) return
    
    messageApi.success('결과가 저장되었습니다.')
    // 실제 저장 로직은 백엔드 API와 연결 필요
  }
  
  // 다시 실행
  const handleRerun = () => {
    handleExecute()
  }
  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <Text>랜덤 뽑기 정보를 불러오는 중...</Text>
      </div>
    )
  }
  
  if (!picker) {
    return (
      <div className={styles.errorContainer}>
        <Empty
          description="랜덤 뽑기를 찾을 수 없습니다."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" onClick={() => navigate('/random-picker')}>
          목록으로 돌아가기
        </Button>
      </div>
    )
  }
  
  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <div>
              <Tag color={getStatusTagColor(picker.status)}>
                {getStatusText(picker.status)}
              </Tag>
              <Title level={2} className={styles.title}>{picker.title || '(제목 없음)'}</Title>
              <Paragraph>{picker.description || '(설명 없음)'}</Paragraph>
            </div>
            
            <div className={styles.actions}>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={handleEdit}
              >
                수정
              </Button>
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                onClick={showDeleteConfirm}
              >
                삭제
              </Button>
            </div>
          </div>
          
          <Divider />
          
          <div className={styles.infoSection}>
            <Title level={4}>항목 목록</Title>
            {picker.items && picker.items.length > 0 ? (
              <List
                bordered
                className={styles.itemList}
                dataSource={picker.items}
                renderItem={(item, index) => (
                  <List.Item>
                    <Text>{index + 1}. {item.content}</Text>
                  </List.Item>
                )}
              />
            ) : (
              <Empty 
                description="등록된 항목이 없습니다." 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            )}
          </div>
          
          <div className={styles.executeSection}>
            <Title level={4}>랜덤 선택 실행</Title>
            <div className={styles.executeInfo}>
              <Space direction="vertical">
                <Text>선택할 항목 수: <Text strong>{picker.pickCount}</Text>개</Text>
                <Text>중복 선택 허용: <Text strong>{picker.allowDuplicates ? '예' : '아니오'}</Text></Text>
                <Text>총 항목 수: <Text strong>{picker.items?.length || 0}</Text>개</Text>
              </Space>
              
              <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleOutlined />} 
                onClick={handleExecute}
                loading={isExecuteLoading}
                disabled={!picker.items || picker.items.length === 0}
              >
                선택 시작
              </Button>
            </div>
          </div>
          
          {isExecuting || pickedItems.length > 0 ? (
            <div className={styles.resultSection}>
              <PickerResult
                loading={isExecuteLoading}
                pickedItems={pickedItems}
                onRerun={handleRerun}
                onCopy={handleCopyResult}
                onSave={handleSaveResult}
              />
            </div>
          ) : null}
          
          <div className={styles.historySection}>
            <PickerHistory 
              results={[]}
              onResultClick={(resultId) => console.log('Result clicked:', resultId)}
            />
          </div>
        </Card>
      </div>
      
      <Modal
        title="랜덤 뽑기 삭제"
        open={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        okText="삭제"
        cancelText="취소"
        okButtonProps={{ danger: true }}
      >
        <p>이 랜덤 뽑기를 삭제하시겠습니까?</p>
        <p>이 작업은 되돌릴 수 없습니다.</p>
      </Modal>
    </>
  )
} 