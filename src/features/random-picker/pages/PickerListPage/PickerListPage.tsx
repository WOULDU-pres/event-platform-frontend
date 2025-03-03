import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Button, Select, message, Spin, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { usePickers } from '../../api/randomPickerApi'
import { PickerList } from '../../components/PickerList/PickerList'
import { PickerStatus } from '../../types/picker'
import styles from './PickerListPage.module.css'

const { Title } = Typography
const { Option } = Select

export function PickerListPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<PickerStatus | 'all'>('all')
  const [messageApi, contextHolder] = message.useMessage()
  
  // 피커 목록 불러오기
  const { 
    data: pickers,
    isLoading,
    isError,
  } = usePickers()
  
  // 에러 처리
  useEffect(() => {
    if (isError) {
      messageApi.error('랜덤 뽑기 목록을 불러오는 중 오류가 발생했습니다.')
    }
  }, [isError, messageApi])
  
  // 필터링된 피커 목록
  const filteredPickers = pickers?.filter(
    picker => statusFilter === 'all' || picker.status === statusFilter
  ) || []
  
  // 피커 클릭 시 상세 페이지로 이동
  const handlePickerClick = (pickerId: string) => {
    navigate(`/random-picker/${pickerId}`)
  }
  
  // 새 피커 생성 페이지로 이동
  const handleCreateClick = () => {
    navigate('/random-picker/create')
  }
  
  // 상태 필터 변경
  const handleStatusChange = (value: PickerStatus | 'all') => {
    setStatusFilter(value)
  }
  
  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.header}>
          <Title level={2}>랜덤 뽑기</Title>
          <div className={styles.actions}>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              className={styles.statusFilter}
            >
              <Option value="all">모든 상태</Option>
              <Option value="DRAFT">임시저장</Option>
              <Option value="SAVED">저장됨</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateClick}
            >
              새 뽑기 만들기
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
            <p>뽑기 목록을 불러오는 중...</p>
          </div>
        ) : isError ? (
          <div className={styles.errorContainer}>
            <Empty
              description="목록을 불러오지 못했습니다."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Button 
              onClick={() => window.location.reload()}
              type="primary"
            >
              다시 시도
            </Button>
          </div>
        ) : (
          <PickerList
            pickers={filteredPickers}
            onPickerClick={handlePickerClick}
            onCreateClick={handleCreateClick}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </>
  )
} 