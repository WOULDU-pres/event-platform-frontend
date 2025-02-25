import { Card, Typography, Tag, Button, Descriptions, Row, Col, Image } from 'antd'
import styles from './RaffleDetail.module.css'
import type { RaffleEvent, RafflePrize } from '../../types/raffle'
import type { RaffleStatus } from '../../types/raffle'
import { safeFormatDate } from '../../../../common/utils/dateUtils'

const { Title, Paragraph } = Typography

interface RaffleDetailProps {
  raffle: RaffleEvent
  prizes: RafflePrize[]
  onEdit?: () => void
  onDelete?: () => void
}

const statusToTagColor: Record<RaffleStatus, string> = {
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

export function RaffleDetail({ raffle, prizes, onEdit, onDelete }: RaffleDetailProps) {
  // 날짜 형식이 올바르지 않은 경우 기본값으로 대체
  const startDate = safeFormatDate(raffle.startDate);
  const endDate = safeFormatDate(raffle.endDate);
  const drawDate = safeFormatDate(raffle.drawDate);

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div>
            <Tag color={statusToTagColor[raffle.status] || 'default'}>
              {statusText[raffle.status] || '알 수 없음'}
            </Tag>
            <Title level={2} className={styles.title}>{raffle.title || '(제목 없음)'}</Title>
            <Paragraph type="secondary">{raffle.description || '(설명 없음)'}</Paragraph>
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
            alt={raffle.title || '럭키드로우 이미지'}
            fallback="/placeholder-raffle.png"
          />
        </div>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 2 }}
          className={styles.descriptions}
        >
          <Descriptions.Item label="응모 기간">
            {startDate} - {endDate}
          </Descriptions.Item>
          <Descriptions.Item label="추첨일">
            {drawDate}
          </Descriptions.Item>
          <Descriptions.Item label="참여 현황">
            {raffle.currentParticipants || 0}/{raffle.maxParticipants || '-'}명
          </Descriptions.Item>
          <Descriptions.Item label="당첨자 수">
            {raffle.numberOfWinners || '-'}명
          </Descriptions.Item>
        </Descriptions>

        <div className={styles.prizes}>
          <Title level={3}>경품 정보</Title>
          <Row gutter={[16, 16]}>
            {prizes && prizes.length > 0 ? (
              prizes.map(prize => (
                <Col key={prize.id} xs={24} sm={12}>
                  <Card className={styles.prizeCard}>
                    {prize.imageUrl && (
                      <Image
                        src={prize.imageUrl}
                        alt={prize.name || '경품 이미지'}
                        className={styles.prizeImage}
                        fallback="/placeholder-prize.png"
                      />
                    )}
                    <div className={styles.prizeInfo}>
                      <Tag color="blue" className={styles.prizeRank}>
                        {prize.rank || 1}등
                      </Tag>
                      <Title level={4} className={styles.prizeName}>{prize.name || '(경품명 없음)'}</Title>
                      <Paragraph type="secondary">{prize.description || '(설명 없음)'}</Paragraph>
                      <Paragraph>수량: {prize.quantity || 0}개</Paragraph>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Paragraph type="secondary" className={styles.emptyPrizes}>
                  등록된 경품이 없습니다.
                </Paragraph>
              </Col>
            )}
          </Row>
        </div>
      </Card>
    </div>
  )
} 