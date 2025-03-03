import React from 'react'
import { Spin } from 'antd'
import { GiftOutlined } from '@ant-design/icons'
import { RandomBox } from '../../types'
import BoxCard from '../BoxCard/BoxCard'
import styles from './BoxList.module.css'

interface BoxListProps {
  boxes: RandomBox[]
  title?: string
  selectedBoxId?: string | null
  loading?: boolean
  onBoxSelect?: (boxId: string) => void
  emptyText?: string
}

/**
 * 랜덤박스 목록 컴포넌트
 * 여러 랜덤박스를 그리드 형태로 표시
 */
const BoxList: React.FC<BoxListProps> = ({
  boxes,
  title,
  selectedBoxId,
  loading = false,
  onBoxSelect,
  emptyText = '표시할 랜덤박스가 없습니다.'
}) => {
  // 로딩 상태 표시
  if (loading) {
    return (
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.emptyState}>
          <Spin size="large" />
        </div>
      </div>
    )
  }

  // 빈 상태 표시
  if (!boxes || boxes.length === 0) {
    return (
      <div className={styles.container}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.emptyState}>
          <GiftOutlined className={styles.emptyIcon} />
          <div className={styles.emptyText}>{emptyText}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.grid}>
        {boxes.map(box => (
          <BoxCard
            key={box.id}
            box={box}
            isSelected={selectedBoxId === box.id}
            onClick={onBoxSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default BoxList 