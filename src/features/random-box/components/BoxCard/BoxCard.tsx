import React from 'react'
import { Card, Badge } from 'antd'
import { GiftOutlined } from '@ant-design/icons'
import { RandomBox } from '../../types'
import { BOX_TYPE_TEXT, BOX_TYPE_COLOR } from '../../constants'
import styles from './BoxCard.module.css'

interface BoxCardProps {
  box: RandomBox
  isSelected?: boolean
  onClick?: (boxId: string) => void
}

/**
 * 랜덤박스 카드 컴포넌트
 * 각 랜덤박스의 정보를 카드 형태로 표시
 */
const BoxCard: React.FC<BoxCardProps> = ({ box, isSelected = false, onClick }) => {
  // 재고 상태 계산
  const stockRemaining = box.maxQuantity - box.soldCount
  const isSoldOut = stockRemaining <= 0
  const isAlmostSoldOut = stockRemaining <= box.maxQuantity * 0.1 // 10% 이하 남음
  
  // 카드 클릭 핸들러
  const handleClick = () => {
    if (onClick) {
      onClick(box.id)
    }
  }
  
  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
      onClick={handleClick}
    >
      <div 
        className={styles.cardImage}
        style={box.imageUrl ? { backgroundImage: `url(${box.imageUrl})` } : undefined}
      >
        {!box.imageUrl && (
          <GiftOutlined className={styles.cardImagePlaceholder} />
        )}
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{box.name}</h3>
          <Badge
            color={BOX_TYPE_COLOR[box.type]}
            text={BOX_TYPE_TEXT[box.type]}
            className={styles.cardType}
          />
        </div>
        
        <p className={styles.cardDescription}>{box.description}</p>
        
        <div className={styles.cardPrice}>
          {box.price.toLocaleString()}원
        </div>
        
        <div className={`${styles.cardStock} ${isSoldOut ? styles.soldOut : isAlmostSoldOut ? styles.almostSoldOut : ''}`}>
          {isSoldOut 
            ? '품절' 
            : isAlmostSoldOut 
              ? `마감 임박 (${stockRemaining}개 남음)` 
              : `남은 수량: ${stockRemaining.toLocaleString()}개`
          }
        </div>
      </div>
    </div>
  )
}

export default BoxCard 