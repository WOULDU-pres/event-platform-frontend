import React, { useEffect, useState } from 'react'
import { Card, Button, Badge, Typography, Divider, Tag } from 'antd'
import { GiftOutlined, ShareAltOutlined, ShoppingCartOutlined, DownloadOutlined } from '@ant-design/icons'
import { RandomBoxPurchaseResult } from '../../types'
import { ITEM_CATEGORY_TEXT, ITEM_CATEGORY_COLOR } from '../../constants'
import styles from './ResultDisplay.module.css'

const { Text } = Typography

interface ResultDisplayProps {
  result: RandomBoxPurchaseResult
  onShare?: (result: RandomBoxPurchaseResult) => void
  onAddToCart?: (itemId: string) => void
  onDownloadImage?: () => void
}

/**
 * 랜덤박스 구매 결과 표시 컴포넌트
 * 획득한 아이템 정보를 보여주고 공유 기능 제공
 */
const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  onShare,
  onAddToCart,
  onDownloadImage
}) => {
  const [showConfetti, setShowConfetti] = useState(true)
  
  // 결과 로드 시 컨페티 효과 표시
  useEffect(() => {
    // 컨페티 효과는 5초 후 자동으로 사라짐
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // 아이템의 희귀도에 따른 클래스 결정
  const getRarityClass = () => {
    const { item } = result
    const probabilityPercentage = item.probability * 100
    
    if (probabilityPercentage <= 1) {
      return styles.rarityLegendary
    } else if (probabilityPercentage <= 5) {
      return styles.rarityEpic
    } else if (probabilityPercentage <= 15) {
      return styles.rarityRare
    } else if (probabilityPercentage <= 30) {
      return styles.rarityUncommon
    } else {
      return styles.rarityCommon
    }
  }
  
  // 희귀도 텍스트 결정
  const getRarityText = () => {
    const { item } = result
    const probabilityPercentage = item.probability * 100
    
    if (probabilityPercentage <= 1) {
      return '전설급 아이템!'
    } else if (probabilityPercentage <= 5) {
      return '에픽 아이템!'
    } else if (probabilityPercentage <= 15) {
      return '레어 아이템'
    } else if (probabilityPercentage <= 30) {
      return '언커먼 아이템'
    } else {
      return '일반 아이템'
    }
  }
  
  // 획득 시간 포맷팅
  const formatAcquiredTime = () => {
    if (!result.acquiredAt) return '-'
    
    const date = new Date(result.acquiredAt)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  
  // 공유 버튼 클릭 핸들러
  const handleShare = () => {
    if (onShare) {
      onShare(result)
    }
  }
  
  // 장바구니 추가 버튼 클릭 핸들러
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(result.item.id)
    }
  }
  
  // 이미지 다운로드 버튼 클릭 핸들러
  const handleDownloadImage = () => {
    if (onDownloadImage) {
      onDownloadImage()
    }
  }
  
  // 컨페티 효과 렌더링
  const renderConfetti = () => {
    if (!showConfetti) return null
    
    return (
      <div className={styles.confetti}>
        {/* 컨페티 효과는 실제 구현 시 라이브러리(react-confetti 등) 사용 권장 */}
      </div>
    )
  }
  
  // 아이템 정보 그리드 렌더링
  const renderItemInfoGrid = () => {
    const { item, boxName } = result
    
    return (
      <div className={styles.itemInfoGrid}>
        <div className={styles.itemInfoItem}>
          <div className={styles.itemInfoLabel}>획득 박스</div>
          <div className={styles.itemInfoValue}>{boxName}</div>
        </div>
        
        <div className={styles.itemInfoItem}>
          <div className={styles.itemInfoLabel}>획득 시간</div>
          <div className={styles.itemInfoValue}>{formatAcquiredTime()}</div>
        </div>
        
        <div className={styles.itemInfoItem}>
          <div className={styles.itemInfoLabel}>획득 확률</div>
          <div className={styles.itemInfoValue}>{(item.probability * 100).toFixed(2)}%</div>
        </div>
        
        {item.value !== undefined && (
          <div className={styles.itemInfoItem}>
            <div className={styles.itemInfoLabel}>아이템 가치</div>
            <div className={styles.itemInfoValue}>{item.value.toLocaleString()}원</div>
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className={styles.container}>
      {renderConfetti()}
      
      <div className={styles.header}>
        <h1 className={styles.title}>축하합니다!</h1>
        <div className={styles.subTitle}>아래 아이템을 획득하셨습니다.</div>
      </div>
      
      <Card className={styles.itemCard}>
        <div className={styles.itemImage}>
          {result.item.imageUrl ? (
            <>
              <div 
                className={styles.itemImageBackground}
                style={{ backgroundImage: `url(${result.item.imageUrl})` }}
              />
              <div 
                className={styles.itemImageInner}
                style={{ backgroundImage: `url(${result.item.imageUrl})` }}
              />
            </>
          ) : (
            <GiftOutlined className={styles.imagePlaceholder} />
          )}
        </div>
        
        <div className={styles.itemContent}>
          <h2 className={styles.itemName}>{result.item.name}</h2>
          
          <div className={styles.itemCategory}>
            <Badge
              color={ITEM_CATEGORY_COLOR[result.item.category]}
              text={ITEM_CATEGORY_TEXT[result.item.category]}
            />
          </div>
          
          <div className={styles.rarity}>
            <Tag className={getRarityClass()}>{getRarityText()}</Tag>
          </div>
          
          {renderItemInfoGrid()}
          
          <Divider style={{ margin: '12px 0' }} />
          
          <p className={styles.itemDescription}>{result.item.description}</p>
          
          <div className={styles.actionButtons}>
            {onAddToCart && (
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
              >
                장바구니에 추가
              </Button>
            )}
            
            {onDownloadImage && (
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadImage}
              >
                이미지 저장
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      {onShare && (
        <div className={styles.shareSection}>
          <div className={styles.shareTitle}>친구들에게 자랑하기</div>
          <div className={styles.shareButtons}>
            <Button
              type="primary"
              icon={<ShareAltOutlined />}
              className={styles.shareButton}
              onClick={handleShare}
            >
              공유하기
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultDisplay 