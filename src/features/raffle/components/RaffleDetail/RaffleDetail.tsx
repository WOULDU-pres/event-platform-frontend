import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card, Typography, Tag, Button, Descriptions, Row, Col, Image } from 'antd'
import styles from './RaffleDetail.module.css'
import type { RaffleEvent, RafflePrize } from '../../types/raffle'
import type { RaffleStatus } from '../../types/raffle'

const { Title, Paragraph } = Typography

interface RaffleDetailProps {
  raffle: RaffleEvent
  prizes: RafflePrize[]
  onEdit?: () => void
  onDelete?: () => void
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

export function RaffleDetail({ raffle, prizes, onEdit, onDelete }: RaffleDetailProps) {
  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div>
            <Tag color={statusToTagColor[raffle.status]}>
              {statusText[raffle.status]}
            </Tag>
            <Title level={2} className={styles.title}>{raffle.title}</Title>
            <Paragraph type="secondary">{raffle.description}</Paragraph>
          </div>
          {(onEdit || onDelete) && (
            <div className={styles.actions}>
              {onEdit && (
                <Button type="primary" ghost onClick={onEdit}>수정</Button>
              )}
              {onDelete && (
                <Button danger onClick={onDelete}>삭제</Button>
              )}
            </div>
          )}
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src={raffle.imageUrl || '/placeholder-raffle.png'}
            alt={raffle.title}
            fallback="/placeholder-raffle.png"
          />
        </div>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 2 }}
          className={styles.descriptions}
        >
          <Descriptions.Item label="응모 기간">
            {format(new Date(raffle.startDate), 'yyyy.MM.dd HH:mm', { locale: ko })} - 
            {format(new Date(raffle.endDate), 'yyyy.MM.dd HH:mm', { locale: ko })}
          </Descriptions.Item>
          <Descriptions.Item label="추첨일">
            {format(new Date(raffle.drawDate), 'yyyy.MM.dd HH:mm', { locale: ko })}
          </Descriptions.Item>
          <Descriptions.Item label="참여 현황">
            {raffle.currentParticipants}/{raffle.maxParticipants}명
          </Descriptions.Item>
          <Descriptions.Item label="당첨자 수">
            {raffle.numberOfWinners}명
          </Descriptions.Item>
        </Descriptions>

        <div className={styles.prizes}>
          <Title level={3}>경품 정보</Title>
          <Row gutter={[16, 16]}>
            {prizes.map(prize => (
              <Col key={prize.id} xs={24} sm={12}>
                <Card className={styles.prizeCard}>
                  {prize.imageUrl && (
                    <Image
                      src={prize.imageUrl}
                      alt={prize.name}
                      className={styles.prizeImage}
                      fallback="/placeholder-prize.png"
                    />
                  )}
                  <div className={styles.prizeInfo}>
                    <Tag color="blue" className={styles.prizeRank}>
                      {prize.rank}등
                    </Tag>
                    <Title level={4} className={styles.prizeName}>{prize.name}</Title>
                    <Paragraph type="secondary">{prize.description}</Paragraph>
                    <Paragraph>수량: {prize.quantity}개</Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Card>
    </div>
  )
} 