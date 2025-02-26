import { Card, Tag, Typography, Space, Button } from 'antd'
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { AttendanceEvent, AttendanceEventStatus } from '../../types/attendance'
import styles from './AttendanceCard.module.css'

const { Title, Text } = Typography

interface AttendanceCardProps {
  event: AttendanceEvent
  onClick?: () => void
}

export function AttendanceCard({ event, onClick }: AttendanceCardProps) {
  const navigate = useNavigate()
  
  const statusColors: Record<AttendanceEventStatus, string> = {
    DRAFT: 'default',
    UPCOMING: 'blue',
    ACTIVE: 'green',
    COMPLETED: 'volcano',
    CANCELLED: 'grey'
  }
  
  const statusText: Record<AttendanceEventStatus, string> = {
    DRAFT: '임시저장',
    UPCOMING: '예정',
    ACTIVE: '진행중',
    COMPLETED: '완료',
    CANCELLED: '취소'
  }
  
  const handleClick = () => {
    navigate(`/attendance/${event.id}`)
  }
  
  // 날짜 형식화
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('날짜 형식 오류:', dateString)
      return '날짜 오류'
    }
  }
  
  return (
    <Card 
      className={styles.card}
      cover={
        <div className={styles.cardCover}>
          <img
            alt={event.title}
            src={event.imageUrl || '/placeholder-attendance.png'}
            className={styles.cardImage}
          />
          <div className={styles.statusTag}>
            <Tag color={statusColors[event.status]}>
              {statusText[event.status]}
            </Tag>
          </div>
        </div>
      }
      hoverable
      onClick={onClick || handleClick}
    >
      <Title level={4} className={styles.title} ellipsis={{ tooltip: event.title }}>
        {event.title}
      </Title>
      
      <div className={styles.info}>
        <Space className={styles.infoItem}>
          <CalendarOutlined />
          <Text>{formatDate(event.startDate)} ~ {formatDate(event.endDate)}</Text>
        </Space>
        
        <Space className={styles.infoItem}>
          <EnvironmentOutlined />
          <Text>{event.location}</Text>
        </Space>
        
        <Space className={styles.infoItem}>
          <TeamOutlined />
          <Text>{event.currentParticipants}/{event.maxParticipants} 명</Text>
        </Space>
      </div>
      
      <div className={styles.footer}>
        <Space>
          {event.qrCodeEnabled && (
            <Tag color="purple">QR 출석체크</Tag>
          )}
          <Button type="link" size="small" onClick={(e) => {
            e.stopPropagation();
            navigate(`/attendance/${event.id}`);
          }}>
            자세히 보기
          </Button>
        </Space>
      </div>
    </Card>
  )
} 