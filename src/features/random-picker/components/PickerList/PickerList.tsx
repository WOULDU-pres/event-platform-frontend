import { Select, Button, Row, Col, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PickerCard } from '../PickerCard/PickerCard'
import { PickerConfig, PickerStatus } from '../../types/picker'
import styles from './PickerList.module.css'

const { Option } = Select

interface PickerListProps {
  pickers: PickerConfig[]
  onPickerClick: (id: string) => void
  onCreateClick: () => void
  onStatusChange: (status: PickerStatus | 'all') => void
}

export function PickerList({ 
  pickers, 
  onPickerClick, 
  onCreateClick,
  onStatusChange 
}: PickerListProps) {
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
          <Option value="SAVED">저장됨</Option>
        </Select>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={onCreateClick}
        >
          새 랜덤 뽑기 만들기
        </Button>
      </div>      

      {Array.isArray(pickers) && pickers.length > 0 ? (
        <Row gutter={[16, 16]} className={styles.list}>
          {pickers.map(picker => (
            <Col 
              key={picker.id} 
              xs={24} 
              sm={12} 
              md={8} 
              lg={6}
              className={styles.item}
            >
              <PickerCard
                picker={picker}
                onClick={() => onPickerClick(picker.id)}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="등록된 랜덤 뽑기가 없습니다."
          className={styles.empty}
        >
          <Button type="primary" onClick={onCreateClick}>
            새 랜덤 뽑기 만들기
          </Button>
        </Empty>
      )}
    </div>
  )
} 