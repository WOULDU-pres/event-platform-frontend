import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Button, Spin, message, Card, Divider } from 'antd'
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons'
import { useAttendanceEventDetail, useAttendanceStatistics } from '../../api/attendanceApi'
import { AttendanceStatistics } from '../../components/AttendanceStatistics/AttendanceStatistics'
import { ATTENDANCE_ERROR_MESSAGES } from '../../constants/attendanceConstants'
import { safeFormatDate } from '../../util/attendanceUtils'
import styles from './AttendanceStatisticsPage.module.css'

const { Title, Text } = Typography

export function AttendanceStatisticsPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()

  // 이벤트 정보 조회
  const { 
    data: event,
    isLoading: isLoadingEvent, 
    error: eventError 
  } = useAttendanceEventDetail(id)

  // 통계 데이터 조회
  const { 
    data: statistics,
    isLoading: isLoadingStats,
    error: statsError 
  } = useAttendanceStatistics(id)

  // 에러 처리
  useEffect(() => {
    if (eventError) {
      messageApi.error(ATTENDANCE_ERROR_MESSAGES.LOAD_EVENT_FAILED)
    }
    if (statsError) {
      messageApi.error(ATTENDANCE_ERROR_MESSAGES.LOAD_STATISTICS_FAILED)
    }
  }, [eventError, statsError, messageApi])

  // 뒤로가기
  const handleBack = () => {
    navigate(`/attendance/${id}`)
  }

  // 통계 데이터 다운로드
  const handleDownload = () => {
    if (!statistics || !event) return

    // CSV 형식으로 데이터 생성
    const csvData = [
      `이벤트명,${event.title}`,
      `날짜,${safeFormatDate(event.startDate)}`,
      `장소,${event.location || '정보 없음'}`,
      '',
      '출석 현황',
      '상태,인원,비율',
      `출석,${statistics.presentCount},${statistics.presentRate}%`,
      `지각,${statistics.lateCount},${(statistics.lateCount / statistics.totalParticipants * 100).toFixed(1)}%`,
      `결석,${statistics.absentCount},${(statistics.absentCount / statistics.totalParticipants * 100).toFixed(1)}%`,
      `미확인,${statistics.pendingCount},${(statistics.pendingCount / statistics.totalParticipants * 100).toFixed(1)}%`,
      '',
      '참석자 명단',
      '이름,상태,체크인 시간'
    ]

    // 참석자 데이터 추가
    if (statistics.participantDetails) {
      statistics.participantDetails.forEach(participant => {
        csvData.push(`${participant.name},${participant.status},${participant.checkInTime || '-'}`)
      })
    }

    // CSV 파일 생성 및 다운로드
    const csvContent = csvData.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${event.title}_출석통계_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    messageApi.success('통계 데이터가 CSV 파일로 다운로드되었습니다')
  }

  const isLoading = isLoadingEvent || isLoadingStats
  const hasError = eventError || statsError

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    )
  }

  if (hasError || !event || !statistics) {
    return (
      <div className={styles.errorContainer}>
        <Title level={4}>통계 정보를 불러올 수 없습니다</Title>
        <Button type="primary" onClick={() => navigate(`/attendance/${id}`)}>
          이벤트로 돌아가기
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.header}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className={styles.backButton}
        >
          이벤트로 돌아가기
        </Button>
        <Title level={2} className={styles.title}>출석 통계</Title>
        <Text className={styles.eventName}>{event.title}</Text>
      </div>

      <Card className={styles.actionsCard}>
        <div className={styles.eventInfo}>
          <div>
            <Text strong>이벤트 일시:</Text> {safeFormatDate(event.startDate)}
          </div>
          <div>
            <Text strong>장소:</Text> {event.location || '정보 없음'}
          </div>
          <div>
            <Text strong>참가자 수:</Text> {statistics.totalParticipants}명
          </div>
        </div>
        <Divider />
        <div className={styles.actions}>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleDownload}
            disabled={!statistics.totalParticipants}
          >
            통계 데이터 다운로드 (CSV)
          </Button>
        </div>
      </Card>

      <div className={styles.statisticsContainer}>
        <AttendanceStatistics 
          statistics={statistics} 
          eventTitle={event.title}
        />
      </div>
    </div>
  )
} 