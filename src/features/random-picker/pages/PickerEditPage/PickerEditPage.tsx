import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Typography, Spin, message, Empty, Button } from 'antd'
import { PickerForm } from '../../components/PickerForm/PickerForm'
import { usePickerDetail, useUpdatePicker } from '../../api/randomPickerApi'
import { PickerFormData } from '../../types/picker'
import styles from './PickerEditPage.module.css'

const { Title } = Typography

export function PickerEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  
  // API 호출
  const { 
    data: picker, 
    isLoading, 
    isError, 
    error 
  } = usePickerDetail(id || '')
  
  const { mutate: updatePicker, isPending: isUpdating } = useUpdatePicker()
  
  // 에러 처리
  useEffect(() => {
    if (isError && error) {
      messageApi.error('랜덤 뽑기 정보를 불러오는 중 오류가 발생했습니다.')
    }
  }, [isError, error, messageApi])
  
  // 폼 제출 처리
  const handleSubmit = (formData: PickerFormData) => {
    if (!id || !picker) return
    
    updatePicker(
      {
        id,
        ...formData
      },
      {
        onSuccess: () => {
          messageApi.success('랜덤 뽑기가 수정되었습니다.')
          navigate(`/random-picker/${id}`)
        },
        onError: () => {
          messageApi.error('랜덤 뽑기 수정 중 오류가 발생했습니다.')
        }
      }
    )
  }
  
  // 취소 처리
  const handleCancel = () => {
    navigate(`/random-picker/${id}`)
  }
  
  // 목록으로 돌아가기
  const handleBackToList = () => {
    navigate('/random-picker')
  }
  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <p>랜덤 뽑기 정보를 불러오는 중...</p>
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
        <Button type="primary" onClick={handleBackToList}>
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
          <Title level={2}>랜덤 뽑기 수정</Title>
          <PickerForm 
            initialData={picker}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Card>
      </div>
    </>
  )
} 