import { Card, Tag, Typography, Button, Image, Descriptions, Divider, Space, Statistic, Row, Col } from 'antd'
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined, QrcodeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { AttendanceEvent, AttendanceEventStatus } from '../../types/attendance'
import styles from './AttendanceDetail.module.css'

const { Title, Paragraph, Text } = Typography

interface AttendanceDetailProps {
  event: AttendanceEvent
  onEdit?: () => void
  onDelete?: () => void
  onCheckIn?: () => void
  onGenerateQR?: () => void
  onViewStats?: () => void
}

const statusToTagColor: Record<AttendanceEventStatus, string> = {
  DRAFT: 'default',
  UPCOMING: 'blue',
  ACTIVE: 'success',
  COMPLETED: 'purple',
  CANCELLED: 'error'
}

const statusText = {
  DRAFT: '임시저장',
  UPCOMING: '진행 예정',
  ACTIVE: '진행 중',
  COMPLETED: '종료됨',
  CANCELLED: '취소됨'
}

export function AttendanceDetail({
  event,
  onEdit,
  onDelete,
  onCheckIn,
  onGenerateQR,
  onViewStats
}: AttendanceDetailProps) {
  // 날짜 형식이 올바르지 않은 경우 기본값으로 대체
  const safeFormatDate = (dateString: string) => {
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

  const startDate = safeFormatDate(event.startDate)
  const endDate = safeFormatDate(event.endDate)
  
  // 이벤트 상태에 따라 사용 가능한 기능 결정
  const isActive = event.status === 'ACTIVE'
  const isUpcoming = event.status === 'UPCOMING'
  const isCompleted = event.status === 'COMPLETED'
  const isDraft = event.status === 'DRAFT'

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <div>
            <Tag color={statusToTagColor[event.status] || 'default'}>
              {statusText[event.status] || '알 수 없음'}
            </Tag>
            <Title level={2} className={styles.title}>
              {event.title || '(제목 없음)'}
            </Title>
            <Paragraph type="secondary" className={styles.description}>
              {event.description || '(설명 없음)'}
            </Paragraph>
          </div>
          {(onEdit || onDelete) && (
            <div className={styles.actions}>
              {onEdit && (isDraft || isUpcoming) && (
                <Button type="primary" ghost icon={<EditOutlined />} onClick={onEdit}>
                  수정
                </Button>
              )}
              {onDelete && (isDraft || isUpcoming) && (
                <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
                  삭제
                </Button>
              )}
            </div>
          )}
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={event.imageUrl || '/placeholder-attendance.png'}
            alt={event.title || '출석체크 이미지'}
            fallback="/placeholder-attendance.png"
          />
        </div>

        <Divider />

        <Descriptions title="이벤트 정보" layout="vertical" bordered>
          <Descriptions.Item label="주최자" span={3}>
            {event.organizerName}
          </Descriptions.Item>
          <Descriptions.Item label="시작 일시" span={1}>
            <Space>
              <CalendarOutlined />
              {startDate}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="종료 일시" span={2}>
            <Space>
              <CalendarOutlined />
              {endDate}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="장소" span={3}>
            <Space>
              <EnvironmentOutlined />
              {event.location}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="QR 출석체크" span={3}>
            {event.qrCodeEnabled ? (
              <Space>
                <QrcodeOutlined />
                <Text>활성화 (유효시간: {event.qrCodeValidMinutes}분)</Text>
              </Space>
            ) : (
              <Text type="secondary">비활성화</Text>
            )}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Row gutter={16} className={styles.statsRow}>
          <Col span={8}>
            <Statistic
              title="참여자"
              value={event.currentParticipants}
              suffix={`/ ${event.maxParticipants}`}
              valueStyle={{ color: event.currentParticipants >= event.maxParticipants ? '#cf1322' : '#3f8600' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="참여율"
              value={Math.round((event.currentParticipants / event.maxParticipants) * 100)}
              suffix="%"
              precision={0}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="상태"
              value={statusText[event.status] || '알 수 없음'}
              valueStyle={{ color: statusToTagColor[event.status] === 'success' ? '#3f8600' : '#1677ff' }}
            />
          </Col>
        </Row>

        <Divider />

        <div className={styles.bottomActions}>
          <Space wrap>
            {onCheckIn && isActive && (
              <Button type="primary" onClick={onCheckIn}>
                출석체크
              </Button>
            )}
            {onGenerateQR && isActive && event.qrCodeEnabled && (
              <Button onClick={onGenerateQR} icon={<QrcodeOutlined />}>
                QR 코드 생성
              </Button>
            )}
            {onViewStats && (
              <Button onClick={onViewStats}>
                통계 보기
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  )
} 