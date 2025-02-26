import { Card, Typography, Tag, Tooltip } from 'antd'
import { LineChartOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { PickerConfig, PickerStatus } from '../../types/picker'
import { getStatusText, getStatusTagColor } from '../../util/pickerUtils'
import styles from './PickerCard.module.css'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

const { Paragraph, Text } = Typography

interface PickerCardProps {
  picker: PickerConfig
  onClick: () => void
}

export function PickerCard({ picker, onClick }: PickerCardProps) {
  // 항목 개수 계산
  const itemCount = picker.items?.length || 0
  
  // 날짜 포맷팅 (오류에 안전하게)
  const formattedDate = picker.createdAt ? 
    formatDistanceToNow(new Date(picker.createdAt), { 
      addSuffix: true, 
      locale: ko 
    }) : '날짜 정보 없음'
  
  return (
    <Card 
      className={styles.card}
      hoverable
      onClick={onClick}
    >
      <div className={styles.header}>
        <Tag color={getStatusTagColor(picker.status)}>
          {getStatusText(picker.status)}
        </Tag>
        <div className={styles.date}>
          <ClockCircleOutlined /> {formattedDate}
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{picker.title}</h3>
        <Paragraph className={styles.description} ellipsis={{ rows: 2 }}>
          {picker.description || '설명 없음'}
        </Paragraph>
      </div>
      
      <div className={styles.footer}>
        <Tooltip title="항목 개수">
          <span className={styles.stat}>
            <LineChartOutlined /> {itemCount}개 항목
          </span>
        </Tooltip>
        <Tooltip title="선택 개수">
          <span className={styles.stat}>
            <CheckCircleOutlined /> {picker.pickCount}개 선택
          </span>
        </Tooltip>
      </div>
    </Card>
  )
} 