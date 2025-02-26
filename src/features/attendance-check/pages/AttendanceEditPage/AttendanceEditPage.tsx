import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Spin, Typography, Space, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { AttendanceForm } from '../../components/AttendanceForm/AttendanceForm'
import { useAttendanceEventDetail } from '../../api/attendanceApi'
import { useAttendanceForm } from '../../hooks/useAttendance'
import { ATTENDANCE_ERROR_MESSAGES } from '../../constants/attendanceConstants'
import styles from './AttendanceEditPage.module.css'

const { Title } = Typography

export function AttendanceEditPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  
  // 이벤트 정보 조회
  const { 
    data: event, 
    isLoading, 
    error 
  } = useAttendanceEventDetail(id)
  
  // 폼 제출 로직
  const { 
    handleSubmit, 
  } = useAttendanceForm(event)
  
  // 에러 처리
  useEffect(() => {
    if (error) {
      messageApi.error(ATTENDANCE_ERROR_MESSAGES.LOAD_EVENT_FAILED)
    }
  }, [error, messageApi])
  
  // 뒤로가기
  const handleBack = () => {
    navigate(`/attendance/${id}`)
  }
  
  // 취소
  const handleCancel = () => {
    navigate(`/attendance/${id}`)
  }
  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }
  
  if (error || !event) {
    return (
      <div className={styles.errorContainer}>
        <Title level={4}>출석체크를 불러올 수 없습니다</Title>
        <Button type="primary" onClick={() => navigate('/attendance')}>
          목록으로 돌아가기
        </Button>
      </div>
    )
  }
  
  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.header}>
        <Space align="center">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
          >
            돌아가기
          </Button>
          <Title level={2} className={styles.title}>
            출석체크 수정
          </Title>
        </Space>
      </div>
      
      <div className={styles.formContainer}>
        <AttendanceForm
          initialData={event}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
} 