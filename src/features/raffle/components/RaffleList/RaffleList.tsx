import { Select, Button, Empty, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RaffleCard } from '../RaffleCard/RaffleCard'
import styles from './RaffleList.module.css'
import type { RaffleEvent, RaffleStatus } from '../../types/raffle'

interface RaffleListProps {
  raffles: RaffleEvent[]
  onRaffleClick: (id: string) => void
  onCreateClick: () => void
  onStatusChange?: (status: RaffleStatus | 'all') => void
}

const { Option } = Select

export function RaffleList({ 
  raffles, 
  onRaffleClick, 
  onCreateClick,
  onStatusChange 
}: RaffleListProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={onStatusChange}
        >
          <Option value="all">전체</Option>
          <Option value="DRAFT">임시저장</Option>
          <Option value="UPCOMING">진행 예정</Option>
          <Option value="ACTIVE">진행 중</Option>
          <Option value="COMPLETED">종료됨</Option>
          <Option value="CANCELLED">취소됨</Option>
        </Select>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onCreateClick}
        >
          새 럭키드로우 만들기
        </Button>
      </div>      

      {Array.isArray(raffles) && raffles.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.list}>
          {raffles.map(raffle => (
            <Col 
              key={raffle.id} 
              xs={24} 
              sm={12} 
              md={8} 
              lg={6}
              className={styles.item}
            >
              <RaffleCard
                raffle={raffle}
                onClick={() => onRaffleClick(raffle.id)}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="등록된 럭키드로우이 없습니다."
          className={styles.empty}
        >
          <Button type="primary" onClick={onCreateClick}>
            새 럭키드로우 만들기
          </Button>
        </Empty>
      )}
    </div>
  )
} 