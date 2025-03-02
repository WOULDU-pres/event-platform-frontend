import React, { useState, useEffect } from 'react'
import { GiftOutlined, StarOutlined } from '@ant-design/icons'
import { RandomBoxItem } from '../../types'
import styles from './BoxOpeningAnimation.module.css'

interface BoxOpeningAnimationProps {
  isOpening: boolean
  item?: RandomBoxItem
  duration?: number
  onComplete?: () => void
}

/**
 * 랜덤박스 오픈 애니메이션 컴포넌트
 * 3D 박스 열림 효과와 아이템 등장 애니메이션
 */
const BoxOpeningAnimation: React.FC<BoxOpeningAnimationProps> = ({
  isOpening,
  item,
  duration = 3000,
  onComplete
}) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false)
  
  // 애니메이션 효과 실행
  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => {
        setIsBoxOpen(true)
      }, 500)
      
      // 애니메이션 완료 후 콜백 호출
      const completeTimer = setTimeout(() => {
        if (onComplete) {
          onComplete()
        }
      }, duration)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(completeTimer)
      }
    } else {
      setIsBoxOpen(false)
    }
  }, [isOpening, duration, onComplete])
  
  // 랜덤 위치에 반짝이는 효과 생성
  const renderSparkles = () => {
    const sparkles = []
    
    for (let i = 1; i <= 4; i++) {
      sparkles.push(
        <div 
          key={`sparkle-${i}`} 
          className={`${styles.sparkles} ${styles[`sparkle${i}`]}`} 
        />
      )
    }
    
    return sparkles
  }
  
  return (
    <div className={styles.container}>
      <div className={`${styles.box} ${isBoxOpen ? styles.boxOpen : ''}`}>
        <div className={`${styles.boxInner} ${isOpening ? styles.openingAnimation : ''}`}>
          {/* 박스 앞면 */}
          <div className={styles.boxFront}>
            <GiftOutlined className={styles.boxIcon} />
          </div>
          
          {/* 박스 상단 */}
          <div className={styles.boxTop}>
            <GiftOutlined className={styles.boxIcon} />
          </div>
          
          {/* 박스 하단 */}
          <div className={styles.boxBottom}>
            <GiftOutlined className={styles.boxIcon} />
          </div>
          
          {/* 박스 좌측 */}
          <div className={styles.boxLeft}>
            <GiftOutlined className={styles.boxIcon} />
          </div>
          
          {/* 박스 우측 */}
          <div className={styles.boxRight}>
            <GiftOutlined className={styles.boxIcon} />
          </div>
          
          {/* 박스 뒷면 */}
          <div className={styles.boxBack}>
            <GiftOutlined className={styles.boxIcon} />
          </div>
          
          {/* 박스 뚜껑 */}
          <div className={styles.boxLid} />
        </div>
        
        {/* 박스 내용물 (아이템) */}
        <div className={styles.boxContents}>
          {item?.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              width="100%" 
              height="100%" 
              style={{ objectFit: 'contain' }} 
            />
          ) : (
            <StarOutlined className={styles.itemIcon} />
          )}
        </div>
        
        {/* 빛나는 효과 */}
        <div className={styles.glow} />
        
        {/* 반짝이는 효과 */}
        {renderSparkles()}
        
        {/* 리본 장식 */}
        <div className={styles.ribbon}>
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 0L95 45L140 70L95 95L70 140L45 95L0 70L45 45L70 0Z" fill="#FFD700" />
          </svg>
        </div>
      </div>
      
      <div className={styles.loadingText}>
        {isBoxOpen ? '당신의 아이템을 확인하세요!' : '랜덤박스를 열고 있습니다...'}
      </div>
    </div>
  )
}

export default BoxOpeningAnimation 