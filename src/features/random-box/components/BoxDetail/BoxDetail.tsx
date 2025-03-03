import React from 'react'
import { Card, Button, Badge, Progress, Skeleton, Divider } from 'antd'
import { ShoppingOutlined, GiftOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { BoxType, RandomBox } from '../../types'
import { BOX_TYPE_TEXT, BOX_TYPE_COLOR, ITEM_CATEGORY_TEXT, ITEM_CATEGORY_COLOR } from '../../constants'
import { formatProbability } from '../../utils/probabilityCalculator'
import styles from './BoxDetail.module.css'

interface BoxDetailProps {
  box: RandomBox | null
  loading?: boolean
  onPurchase?: () => void
  purchaseLoading?: boolean
}

/**
 * 랜덤박스 상세 정보 컴포넌트
 * 선택된 랜덤박스의 상세 정보 표시
 */
const BoxDetail: React.FC<BoxDetailProps> = ({
  box,
  loading = false,
  onPurchase,
  purchaseLoading = false
}) => {
  // 로딩 상태 표시
  if (loading || !box) {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <Skeleton active avatar paragraph={{ rows: 8 }} />
        </Card>
      </div>
    )
  }

  // 재고 상태 계산
  const stockRemaining = box.maxQuantity - box.soldCount
  const isSoldOut = stockRemaining <= 0
  const stockPercentage = Math.floor((box.soldCount / box.maxQuantity) * 100)

  // 구매 버튼 클릭 핸들러
  const handlePurchase = () => {
    if (onPurchase && !isSoldOut) {
      onPurchase()
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>{box.name}</h2>
          <div className={styles.subtitle}>
            <div className={styles.badgeContainer}>
              <Badge color={BOX_TYPE_COLOR[box.type as BoxType]} text={BOX_TYPE_TEXT[box.type as BoxType]} />
            </div>
          </div>
        </div>

        {/* 이미지 */}
        <div 
          className={styles.image}
          style={box.imageUrl ? { backgroundImage: `url(${box.imageUrl})` } : undefined}
        >
          {!box.imageUrl && (
            <GiftOutlined className={styles.imagePlaceholder} />
          )}
        </div>

        {/* 설명 */}
        <p className={styles.description}>{box.description}</p>

        {/* 아이템 확률 */}
        <h3 className={styles.sectionTitle}>포함된 아이템</h3>
        <div className={styles.probabilityList}>
          {box.itemPool.length > 0 ? (
            box.itemPool.map(item => (
              <div key={item.id} className={styles.probabilityItem}>
                <div className={styles.probabilityItemName}>
                  {item.name}
                  <Badge 
                    className={styles.probabilityItemCategory} 
                    color={ITEM_CATEGORY_COLOR[item.category]} 
                    text={ITEM_CATEGORY_TEXT[item.category]} 
                  />
                </div>
                <div className={styles.probabilityValue}>
                  {formatProbability(item.probability)}
                </div>
              </div>
            ))
          ) : (
            <div>아이템 정보가 없습니다.</div>
          )}
        </div>

        {/* 구매 정보 */}
        <Divider />
        <div className={styles.purchaseInfo}>
          <div className={styles.priceContainer}>
            <span className={styles.priceLabel}>가격</span>
            <span className={styles.price}>{box.price.toLocaleString()}원</span>
          </div>
          
          <div className={styles.stockInfo}>
            <InfoCircleOutlined style={{ marginRight: 8 }} />
            {isSoldOut 
              ? '품절되었습니다.' 
              : `남은 수량: ${stockRemaining.toLocaleString()}개 / ${box.maxQuantity.toLocaleString()}개`
            }
          </div>
          
          <Progress 
            className={styles.stockProgress}
            percent={stockPercentage} 
            status={isSoldOut ? "exception" : "active"} 
            showInfo={false}
          />
          
          <Button
            type="primary"
            icon={<ShoppingOutlined />}
            className={styles.purchaseButton}
            onClick={handlePurchase}
            disabled={isSoldOut}
            loading={purchaseLoading}
          >
            {isSoldOut ? '품절' : `${box.price.toLocaleString()}원 구매하기`}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default BoxDetail 