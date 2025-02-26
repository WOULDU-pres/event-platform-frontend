import { Button, Typography, Space } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { AttendanceForm } from '../../components/AttendanceForm/AttendanceForm'
import { useAttendanceForm } from '../../hooks/useAttendance'
import styles from './AttendanceCreatePage.module.css'

const { Title } = Typography

export function AttendanceCreatePage() {
  const navigate = useNavigate()
  const { handleSubmit, contextHolder } = useAttendanceForm()
  
  // 뒤로가기
  const handleBack = () => {
    navigate('/attendance')
  }
  
  // 취소
  const handleCancel = () => {
    navigate('/attendance')
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
            목록으로
          </Button>
          <Title level={2} className={styles.title}>
            새 출석체크 만들기
          </Title>
        </Space>
      </div>
      
      <div className={styles.formContainer}>
        <AttendanceForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
} 