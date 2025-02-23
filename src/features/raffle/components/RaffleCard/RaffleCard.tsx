import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card, Typography, Tag, Space, Image, Descriptions } from 'antd'
import styles from './RaffleCard.module.css'
import { RaffleEvent } from '../../types/raffle'
import type { RaffleStatus } from '../../types/raffle'

const { Title, Paragraph } = Typography

interface RaffleCardProps {
  raffle: RaffleEvent
  onClick?: () => void
}

const statusToTagColor: Record<RaffleStatus, string> = {
  draft: 'default',
  upcoming: 'blue',
  in_progress: 'success',
  completed: 'purple',
  cancelled: 'error'
}

const statusText = {
  draft: '임시저장',
  upcoming: '진행 예정',
  in_progress: '진행 중',
  completed: '종료됨',
  cancelled: '취소됨'
}

export function RaffleCard({ raffle, onClick }: RaffleCardProps) {
  return (
    <Card
      hoverable
      className={styles.card}
      cover={
        <div className={styles.imageWrapper}>
          <Image
            alt={raffle.title}
            src={raffle.imageUrl || '/placeholder-raffle.png'}
            fallback="/placeholder-raffle.png"
            preview={false}
            className={styles.image}
          />
          <Tag color={statusToTagColor[raffle.status]} className={styles.status}>
            {statusText[raffle.status]}
          </Tag>
        </div>
      }
      onClick={onClick}
    >
      <Space direction="vertical" size="small" className={styles.content}>
        <Title level={4} ellipsis={{ rows: 1 }}>{raffle.title}</Title>
        <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
          {raffle.description}
        </Paragraph>
        
        <Descriptions column={1} size="small">
        <Descriptions.Item label="응모 기간">
          {format(new Date(raffle.startDate), 'MM.dd', { locale: ko })} - 
          {format(new Date(raffle.endDate), 'MM.dd', { locale: ko })}
        </Descriptions.Item>
        <Descriptions.Item label="추첨일">
          {format(new Date(raffle.drawDate), 'MM.dd', { locale: ko })}
        </Descriptions.Item>
        <Descriptions.Item label="참여 현황">
          {raffle.currentParticipants}/{raffle.maxParticipants}명
        </Descriptions.Item>
      </Descriptions>

      </Space>
    </Card>
  )
} 