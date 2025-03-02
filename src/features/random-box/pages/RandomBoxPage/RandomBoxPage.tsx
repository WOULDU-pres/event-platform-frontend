import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Spin, Empty, message, Skeleton, Card, Badge, Tabs, Modal } from 'antd'
import { GiftOutlined, ShoppingOutlined, HistoryOutlined } from '@ant-design/icons'
import { useRandomBoxes, useBoxPurchase, useUserResults } from '../../hooks'
import { STATUS_TEXT, STATUS_COLOR, BOX_TYPE_TEXT, BOX_TYPE_COLOR, ITEM_CATEGORY_COLOR, ITEM_CATEGORY_TEXT, ANIMATION_CONFIG } from '../../constants'
import { formatProbability } from '../../utils/probabilityCalculator'
import styles from './RandomBoxPage.module.css'

// Date formatter helper function (replace with actual import if available)
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

/**
 * 랜덤박스 메인 페이지 컴포넌트
 */
const RandomBoxPage: React.FC = () => {
  // 훅 사용
  const navigate = useNavigate()
  const { events, selectedEvent, selectedBox, isLoading: isLoadingBoxes, error: boxesError, selectEvent, selectBox } = useRandomBoxes()
  const { purchases, isLoading: isLoadingPurchases, error: purchasesError } = useUserResults()
  const { purchaseBox, isLoading: isPurchasing, error: purchaseError, completeAnimation } = useBoxPurchase()
  
  // 로컬 상태
  const [messageApi, contextHolder] = message.useMessage()
  
  // 에러 처리
  React.useEffect(() => {
    if (boxesError) {
      messageApi.error('랜덤박스 정보를 불러오는 중 오류가 발생했습니다.')
      console.error(boxesError)
    }
    
    if (purchasesError) {
      messageApi.error('구매 기록을 불러오는 중 오류가 발생했습니다.')
      console.error(purchasesError)
    }
    
    if (purchaseError) {
      messageApi.error('구매 중 오류가 발생했습니다.')
      console.error(purchaseError)
    }
  }, [boxesError, purchasesError, purchaseError, messageApi])
  
  // 박스 구매 핸들러
  const handlePurchase = async () => {
    try {
      await purchaseBox()
      
      // 실제 구현에서는 애니메이션 컴포넌트에서 완료 후 호출
      setTimeout(() => {
        completeAnimation()
      }, ANIMATION_CONFIG.OPEN_DURATION + ANIMATION_CONFIG.REVEAL_DELAY)
    } catch (error) {
      messageApi.error('구매에 실패했습니다. 다시 시도해주세요.')
      console.error(error)
    }
  }
  
  // 구매 기록 항목 클릭 핸들러
  const handlePurchaseClick = (purchaseId: string) => {
    navigate(`/random-box/result/${purchaseId}`)
  }
  
  // 로딩 표시
  if (isLoadingBoxes && !selectedEvent) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="랜덤박스 정보를 불러오는 중..." />
      </div>
    )
  }
  
  return (
    <div className={styles.container}>
      {contextHolder}
      
      <header className={styles.header}>
        <h1 className={styles.title}>랜덤박스</h1>
        <p className={styles.subtitle}>다양한 상품이 담긴 랜덤박스를 구매하고 행운을 시험해보세요!</p>
      </header>
      
      {/* 이벤트 탭 */}
      <div className={styles.eventTabs}>
        <div className={styles.eventTabsInner}>
          {events.map(event => (
            <div 
              key={event.id}
              className={`${styles.eventTab} ${selectedEvent?.id === event.id ? styles.eventTabActive : ''}`}
              onClick={() => selectEvent(event.id)}
            >
              <Badge color={STATUS_COLOR[event.status]} text={event.title} />
              <div>{formatDate(event.startDate)} ~ {formatDate(event.endDate)}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        {/* 박스 목록 */}
        <div className={styles.boxesContainer}>
          <h2>랜덤박스 선택</h2>
          {selectedEvent ? (
            <div className={styles.boxesGrid}>
              {selectedEvent.boxTypes.map(box => (
                <Card 
                  key={box.id}
                  hoverable
                  className={selectedBox?.id === box.id ? 'ant-card-selected' : ''}
                  onClick={() => selectBox(box.id)}
                  cover={box.imageUrl ? <img alt={box.name} src={box.imageUrl} /> : null}
                >
                  <Card.Meta 
                    title={
                      <div>
                        {box.name}
                        <Badge 
                          style={{marginLeft: 8}}
                          color={BOX_TYPE_COLOR[box.type]} 
                          text={BOX_TYPE_TEXT[box.type]} 
                        />
                      </div>
                    }
                    description={box.description}
                  />
                  <div style={{marginTop: 12, fontWeight: 'bold'}}>가격: {box.price.toLocaleString()}원</div>
                  <div>남은 수량: {(box.maxQuantity - box.soldCount).toLocaleString()}개</div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="진행 중인 이벤트가 없습니다." />
          )}
        </div>
        
        {/* 선택된 박스 상세 */}
        <div className={styles.detailContainer}>
          <h2>상세 정보</h2>
          {selectedBox ? (
            <>
              <Card>
                <h3>{selectedBox.name}</h3>
                <p>{selectedBox.description}</p>
                
                <h4>확률 정보</h4>
                {selectedBox.itemPool.length > 0 ? (
                  <ul>
                    {selectedBox.itemPool.map(item => (
                      <li key={item.id}>
                        {item.name} - {formatProbability(item.probability)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>확률 정보가 없습니다.</p>
                )}
                
                <Button 
                  type="primary" 
                  className={styles.purchaseButton}
                  icon={<ShoppingOutlined />}
                  onClick={handlePurchase}
                  loading={isPurchasing}
                  disabled={selectedBox.maxQuantity <= selectedBox.soldCount}
                >
                  {selectedBox.maxQuantity <= selectedBox.soldCount 
                    ? '품절' 
                    : `${selectedBox.price.toLocaleString()}원 구매하기`}
                </Button>
              </Card>
            </>
          ) : (
            <Skeleton active />
          )}
        </div>
      </div>
      
      {/* 구매 기록 */}
      <div className={styles.purchaseHistoryContainer}>
        <h2 className={styles.purchaseHistoryTitle}>
          <HistoryOutlined /> 내 구매 기록
        </h2>
        
        {isLoadingPurchases ? (
          <Skeleton active />
        ) : purchases.length > 0 ? (
          <div className={styles.boxesGrid}>
            {purchases.map(purchase => (
              <Card 
                key={purchase.id}
                hoverable
                onClick={() => handlePurchaseClick(purchase.id)}
              >
                <Card.Meta 
                  title={purchase.result.item.name}
                  description={`구매일: ${formatDate(purchase.purchaseDate)}`}
                />
                <div style={{marginTop: 12}}>
                  <Badge 
                    color={ITEM_CATEGORY_COLOR[purchase.result.item.category]} 
                    text={ITEM_CATEGORY_TEXT[purchase.result.item.category]} 
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <GiftOutlined />
            </div>
            <div className={styles.emptyStateText}>아직 구매 내역이 없습니다.</div>
            <Button type="primary">첫 랜덤박스 구매하기</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RandomBoxPage 