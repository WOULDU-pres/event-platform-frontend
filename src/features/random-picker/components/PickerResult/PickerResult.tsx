import { useState, useEffect } from 'react'
import { Card, Button, Spin, Result, Typography, Space, List, Tag } from 'antd'
import { RedoOutlined, SaveOutlined, CopyOutlined } from '@ant-design/icons'
import { PickerItem } from '../../types/picker'
import styles from './PickerResult.module.css'

const { Title, Text } = Typography

interface PickerResultProps {
  loading: boolean
  error?: string
  pickedItems?: PickerItem[]
  onRerun?: () => void
  onCopy?: () => void
  onSave?: () => void
}

export function PickerResult({ 
  loading, 
  error, 
  pickedItems = [],
  onRerun,
  onCopy,
  onSave
}: PickerResultProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  
  // 결과가 로드되면 애니메이션 표시
  useEffect(() => {
    if (!loading && pickedItems.length > 0) {
      setShowAnimation(true)
      
      // 애니메이션 종료 후 결과 표시
      const timer = setTimeout(() => {
        setShowAnimation(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [loading, pickedItems])
  
  if (loading) {
    return (
      <Card className={styles.card}>
        <div className={styles.loading}>
          <Spin size="large" />
          <Text>결과를 가져오는 중...</Text>
        </div>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card className={styles.card}>
        <Result
          status="error"
          title="오류가 발생했습니다"
          subTitle={error}
          extra={
            <Button type="primary" onClick={onRerun}>
              다시 시도
            </Button>
          }
        />
      </Card>
    )
  }
  
  if (!pickedItems || pickedItems.length === 0) {
    return (
      <Card className={styles.card}>
        <Result
          status="info"
          title="선택된 항목이 없습니다"
          subTitle="선택 버튼을 클릭하여 항목을 선택해주세요"
        />
      </Card>
    )
  }
  
  if (showAnimation) {
    return (
      <Card className={styles.card}>
        <div className={styles.animation}>
          <Title level={3} className={styles.animationText}>
            선택 중...
          </Title>
        </div>
      </Card>
    )
  }
  
  return (
    <Card className={styles.card}>
      <div className={styles.result}>
        <Title level={3} className={styles.resultTitle}>
          선택 결과
        </Title>
        
        <List
          className={styles.resultList}
          dataSource={pickedItems}
          renderItem={(item, index) => (
            <List.Item className={styles.resultItem}>
              <Card className={styles.resultItemCard}>
                <div className={styles.resultItemContent}>
                  <Tag color="blue" className={styles.resultItemNumber}>
                    {index + 1}
                  </Tag>
                  <Text className={styles.resultItemText}>
                    {item.content}
                  </Text>
                </div>
              </Card>
            </List.Item>
          )}
        />
        
        <Space className={styles.actions}>
          <Button icon={<RedoOutlined />} onClick={onRerun}>
            다시 선택
          </Button>
          <Button icon={<CopyOutlined />} onClick={onCopy}>
            결과 복사
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
            결과 저장
          </Button>
        </Space>
      </div>
    </Card>
  )
} 