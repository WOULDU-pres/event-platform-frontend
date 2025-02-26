import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Spin, Tabs, Typography, Modal, Space, message } from 'antd'
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useAttendanceDetail } from '../../hooks/useAttendance'
import { AttendanceDetail } from '../../components/AttendanceDetail/AttendanceDetail'
import { AttendanceList } from '../../components/AttendanceList/AttendanceList'
import { QRCodeGenerator } from '../../components/QRCodeGenerator/QRCodeGenerator'
import { AttendanceStatistics } from '../../components/AttendanceStatistics/AttendanceStatistics'
import { ATTENDANCE_QR_CONSTANTS } from '../../constants/attendanceConstants'
import styles from './AttendanceDetailPage.module.css'

const { Title } = Typography
const { TabPane } = Tabs
const { confirm } = Modal

export function AttendanceDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('details')
  
  const {
    event,
    participants,
    statistics,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleCheckIn,
    handleGenerateQR,
    handleViewStats,
    isEventActive,
  } = useAttendanceDetail(id)

  // 삭제 확인 모달
  const showDeleteConfirm = () => {
    confirm({
      title: '출석체크를 삭제하시겠습니까?',
      icon: <ExclamationCircleOutlined />,
      content: '이 작업은 되돌릴 수 없으며, 모든 참가자 데이터가 삭제됩니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: handleDelete,
    })
  }

  // 뒤로가기
  const handleBack = () => {
    navigate('/attendance')
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
        <Button type="primary" onClick={handleBack}>
          목록으로 돌아가기
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className={styles.backButton}
        >
          목록으로
        </Button>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        className={styles.tabs}
        destroyInactiveTabPane
      >
        <TabPane tab="상세 정보" key="details">
          <AttendanceDetail 
            event={event}
            onEdit={handleEdit}
            onDelete={showDeleteConfirm}
            onCheckIn={isEventActive ? handleCheckIn : undefined}
            onGenerateQR={isEventActive ? handleGenerateQR : undefined}
            onViewStats={handleViewStats}
          />
        </TabPane>
        
        <TabPane tab="참석자 명단" key="participants">
          {participants && (
            <AttendanceList 
              participants={participants} 
              eventId={id}
              isEventActive={isEventActive}
            />
          )}
        </TabPane>
        
        {isEventActive && (
          <TabPane tab="QR 코드" key="qrcode">
            <QRCodeGenerator 
              eventId={id} 
              validMinutes={ATTENDANCE_QR_CONSTANTS.DEFAULT_VALID_MINUTES} 
            />
          </TabPane>
        )}
        
        <TabPane tab="통계" key="statistics">
          {statistics && <AttendanceStatistics statistics={statistics} eventTitle={event.title} />}
        </TabPane>
      </Tabs>
    </div>
  )
} 