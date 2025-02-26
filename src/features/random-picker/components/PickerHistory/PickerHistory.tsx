import { Card, Typography, List, Tag, Divider, Empty } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { PickerResult } from '../../types/picker'
import styles from './PickerHistory.module.css'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

const { Title, Text } = Typography

interface PickerHistoryProps {
  results: PickerResult[]
  onResultClick?: (resultId: string) => void
}

export function PickerHistory({ results = [], onResultClick }: PickerHistoryProps) {
  if (results.length === 0) {
    return (
      <Card className={styles.card}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="이전 선택 결과가 없습니다."
        />
      </Card>
    )
  }

  return (
    <Card className={styles.card}>
      <Title level={4} className={styles.title}>이전 선택 결과</Title>
      
      <List
        dataSource={results}
        renderItem={(result) => {
          // 날짜 포맷팅
          const formattedDate = result.pickedAt ? 
            format(new Date(result.pickedAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko }) : 
            '날짜 정보 없음'
          
          return (
            <List.Item 
              className={styles.historyItem}
              onClick={() => onResultClick && onResultClick(result.id)}
            >
              <div className={styles.historyContent}>
                <div className={styles.historyHeader}>
                  <Text className={styles.historyDate}>
                    <ClockCircleOutlined /> {formattedDate}
                  </Text>
                  <Tag color="blue">{result.pickedItems.length}개 항목</Tag>
                </div>
                
                <div className={styles.historyResults}>
                  {result.pickedItems.map((item, index) => (
                    <Tag 
                      key={`${result.id}-${index}`}
                      className={styles.historyResultTag}
                    >
                      {item.content}
                    </Tag>
                  ))}
                </div>
              </div>
            </List.Item>
          )
        }}
        itemLayout="vertical"
      />
    </Card>
  )
} 