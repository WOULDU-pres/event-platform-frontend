import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Typography, message } from 'antd'
import { PickerForm } from '../../components/PickerForm/PickerForm'
import { useCreatePicker } from '../../api/randomPickerApi'
import { PickerFormData } from '../../types/picker'
import { createEmptyPicker } from '../../util/pickerUtils'
import styles from './PickerCreatePage.module.css'

const { Title } = Typography

export function PickerCreatePage() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  
  // 기본 피커 데이터
  const emptyPicker = createEmptyPicker()
  
  // API 훅
  const { mutate: createPicker, isPending: isCreating } = useCreatePicker()
  
  // 폼 제출 처리
  const handleSubmit = (formData: PickerFormData) => {
    createPicker(formData, {
      onSuccess: (data) => {
        messageApi.success('랜덤 뽑기가 생성되었습니다.')
        navigate(`/random-picker/${data.id}`)
      },
      onError: () => {
        messageApi.error('랜덤 뽑기 생성 중 오류가 발생했습니다.')
      }
    })
  }
  
  // 취소 처리
  const handleCancel = () => {
    navigate('/random-picker')
  }
  
  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2}>새 랜덤 뽑기 만들기</Title>
          <PickerForm
            initialData={emptyPicker}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isCreating}
          />
        </Card>
      </div>
    </>
  )
} 