import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Spin, Result, Badge, message } from 'antd'
import { ArrowLeftOutlined, ShareAltOutlined, GiftOutlined } from '@ant-design/icons'
import { useUserResults } from '../../hooks'
import { ITEM_CATEGORY_TEXT, ITEM_CATEGORY_COLOR, SHARE_CONFIG } from '../../constants'
import styles from './ResultPage.module.css'

// Date formatter helper function (replace with actual import if available)
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// 안전하게 날짜 포맷팅하는 헬퍼 함수
const safeFormatDate = (value: any): string => {
  // 값이 없거나 함수인 경우 기본값 반환
  if (!value || typeof value === 'function') return '날짜 정보 없음';
  
  // 문자열인 경우 그대로 formatDate 호출
  if (typeof value === 'string') {
    return formatDate(value);
  }
  
  // 객체인 경우 toString 시도
  if (typeof value === 'object') {
    try {
      if (value instanceof Date) {
        return formatDate(value.toISOString());
      }
      return formatDate(String(value));
    } catch (e) {
      return '유효하지 않은 날짜';
    }
  }
  
  // 그 외 케이스는 문자열로 변환 시도
  return formatDate(String(value));
};

/**
 * 랜덤박스 결과 페이지 컴포넌트
 */
const ResultPage: React.FC = () => {
  // URL 파라미터
  const { purchaseId } = useParams<{ purchaseId: string }>()
  const navigate = useNavigate()
  
  // 메시지 API
  const [messageApi, contextHolder] = message.useMessage()
  
  // 결과 데이터 로드
  const { selectedPurchase, selectedResult, isLoading, error } = useUserResults({
    initialPurchaseId: purchaseId
  })
  
  // 에러 처리
  useEffect(() => {
    if (error) {
      messageApi.error('결과를 불러오는 중 오류가 발생했습니다.')
      console.error(error)
    }
  }, [error, messageApi])
  
  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate('/random-box')
  }
  
  // 공유하기 핸들러
  const handleShare = () => {
    if (navigator.share && selectedResult) {
      navigator.share({
        title: SHARE_CONFIG.TITLE,
        text: `${SHARE_CONFIG.DESCRIPTION} ${selectedResult.item.name}을(를) 획득했어요!`,
        url: window.location.href,
      })
      .catch((error) => {
        messageApi.error('공유하기를 지원하지 않는 환경입니다.')
        console.error('공유하기 실패:', error)
      })
    } else {
      // 공유 API를 지원하지 않는 브라우저의 경우 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          messageApi.success('링크가 클립보드에 복사되었습니다.')
        })
        .catch((error) => {
          messageApi.error('링크 복사에 실패했습니다.')
          console.error('링크 복사 실패:', error)
        })
    }
  }
  
  // 로딩 표시
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="결과를 불러오는 중..." />
      </div>
    )
  }
  
  // 에러 표시
  if (error || !selectedPurchase || !selectedResult) {
    return (
      <div className={styles.container}>
        {contextHolder}
        <Result
          status="error"
          title="결과를 불러올 수 없습니다"
          subTitle="구매 정보를 찾을 수 없거나 오류가 발생했습니다."
          extra={[
            <Button key="back" type="primary" onClick={handleBack}>
              랜덤박스 페이지로 돌아가기
            </Button>
          ]}
        />
      </div>
    )
  }
  
  const { item } = selectedResult
  
  return (
    <div className={styles.container}>
      {contextHolder}
      
      <Button 
        className={styles.backButton} 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
      >
        랜덤박스로 돌아가기
      </Button>
      
      <header className={styles.header}>
        <h1 className={styles.title}>아이템 획득 결과</h1>
        <p className={styles.subtitle}>랜덤박스에서 다음 아이템을 획득했습니다!</p>
      </header>
      
      <div className={styles.content}>
        <Card className={styles.resultCard}>
          {item.imageUrl ? (
            <img alt={item.name} src={item.imageUrl} />
          ) : (
            <div className={styles.resultCardCover}>
              <GiftOutlined style={{ fontSize: 48, marginRight: 8 }} /> {item.name}
            </div>
          )}
          
          <Card.Meta
            title={<div className={styles.itemName}>{item.name}</div>}
            description={<div className={styles.itemDescription}>{item.description}</div>}
          />
          
          <div className={styles.itemValue}>
            가치: {item.value?.toLocaleString()}원
          </div>
          
          <div className={styles.categoryBadge}>
            <Badge 
              color={ITEM_CATEGORY_COLOR[item.category]} 
              text={ITEM_CATEGORY_TEXT[item.category]} 
            />
          </div>
          
          <div className={styles.purchaseInfo}>
            구매일: {safeFormatDate(selectedPurchase.purchaseDate)}<br />
            획득일: {safeFormatDate(selectedResult.revealedAt)}
          </div>
        </Card>
        
        <div className={styles.actionsContainer}>
          <Button 
            type="primary" 
            icon={<ShareAltOutlined />} 
            onClick={handleShare}
          >
            결과 공유하기
          </Button>
          
          <Button onClick={handleBack}>
            다른 랜덤박스 구매하기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResultPage 