import React, { useEffect, useState } from 'react'
import { Modal, Button, Badge } from 'antd'
import { GiftOutlined, ShoppingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { BoxType, RandomBox, RandomBoxPurchaseResult } from '../../types'
import { BOX_TYPE_TEXT, BOX_TYPE_COLOR, ITEM_CATEGORY_TEXT, ITEM_CATEGORY_COLOR } from '../../constants'
import styles from './PurchaseModal.module.css'

// 모달 상태 타입
type ModalState = 'confirmation' | 'animation' | 'result'

interface PurchaseModalProps {
  box: RandomBox | null
  visible: boolean
  loading: boolean
  purchaseResult: RandomBoxPurchaseResult | null
  onConfirm: () => void
  onCancel: () => void
  onClose: () => void
  isOpeningBox: boolean
}

/**
 * 랜덤박스 구매 모달 컴포넌트
 * 구매 확인, 박스 열기 애니메이션, 결과 표시
 */
const PurchaseModal: React.FC<PurchaseModalProps> = ({
  box,
  visible,
  loading,
  purchaseResult,
  onConfirm,
  onCancel,
  onClose,
  isOpeningBox
}) => {
  // 모달 상태 관리
  const [modalState, setModalState] = useState<ModalState>('confirmation')
  
  // 결과가 있으면 결과 화면으로 변경
  useEffect(() => {
    if (purchaseResult) {
      setModalState('result')
    } else if (isOpeningBox) {
      setModalState('animation')
    } else if (visible) {
      setModalState('confirmation')
    }
  }, [purchaseResult, isOpeningBox, visible])
  
  // 모달 닫을 때 상태 초기화
  useEffect(() => {
    if (!visible) {
      // 약간의 딜레이 후 상태 초기화 (애니메이션 효과를 위해)
      const timer = setTimeout(() => {
        if (!visible) {
          setModalState('confirmation')
        }
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [visible])
  
  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    onConfirm()
    setModalState('animation')
  }
  
  // 모달 제목 결정
  const getTitle = () => {
    switch (modalState) {
      case 'confirmation':
        return '랜덤박스 구매 확인'
      case 'animation':
        return '랜덤박스 오픈 중...'
      case 'result':
        return '축하합니다!'
      default:
        return '랜덤박스'
    }
  }
  
  // 모달 내용 렌더링
  const renderContent = () => {
    if (!box) {
      return null
    }
    
    switch (modalState) {
      case 'confirmation':
        return renderConfirmationContent(box)
      case 'animation':
        return renderAnimationContent()
      case 'result':
        return renderResultContent()
      default:
        return null
    }
  }
  
  // 확인 화면 렌더링
  const renderConfirmationContent = (box: RandomBox) => (
    <div className={styles.modalContent}>
      <div 
        className={styles.boxImage}
        style={box.imageUrl ? { backgroundImage: `url(${box.imageUrl})` } : undefined}
      >
        {!box.imageUrl && (
          <GiftOutlined className={styles.imagePlaceholder} />
        )}
      </div>
      
      <h3 className={styles.boxTitle}>{box.name}</h3>
      
      <div className={styles.boxType}>
        <Badge color={BOX_TYPE_COLOR[box.type as BoxType]} text={BOX_TYPE_TEXT[box.type as BoxType]} />
      </div>
      
      <div className={styles.priceInfo}>
        <div className={styles.price}>{box.price.toLocaleString()}원</div>
      </div>
      
      <p className={styles.confirmText}>
        이 랜덤박스를 구매하시겠습니까?<br />
        구매 후에는 취소할 수 없습니다.
      </p>
      
      <div className={styles.buttonsContainer}>
        <Button 
          type="primary" 
          icon={<ShoppingOutlined />} 
          onClick={handleConfirm}
          loading={loading}
        >
          구매하기
        </Button>
        <Button 
          icon={<CloseCircleOutlined />} 
          onClick={onCancel}
          disabled={loading}
        >
          취소
        </Button>
      </div>
    </div>
  )
  
  // 애니메이션 화면 렌더링
  const renderAnimationContent = () => (
    <div className={styles.animationContainer}>
      <GiftOutlined className={styles.boxOpeningAnimation} />
      <div className={styles.loadingText}>랜덤박스를 열고 있습니다...</div>
    </div>
  )
  
  // 결과 화면 렌더링
  const renderResultContent = () => {
    if (!purchaseResult) {
      return null
    }
    
    const { item } = purchaseResult
    
    return (
      <div className={styles.resultContainer}>
        <h3 className={styles.resultTitle}>축하합니다! 아이템을 획득했습니다!</h3>
        
        <div 
          className={styles.itemImage}
          style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
        >
          {!item.imageUrl && (
            <GiftOutlined className={styles.imagePlaceholder} />
          )}
        </div>
        
        <div className={styles.itemName}>{item.name}</div>
        
        <div className={styles.itemCategory}>
          <Badge 
            color={ITEM_CATEGORY_COLOR[item.category]} 
            text={ITEM_CATEGORY_TEXT[item.category]} 
          />
        </div>
        
        <p className={styles.itemDescription}>{item.description}</p>
        
        <Button 
          type="primary" 
          icon={<CheckCircleOutlined />} 
          onClick={onClose}
        >
          확인
        </Button>
      </div>
    )
  }
  
  return (
    <Modal
      title={getTitle()}
      open={visible}
      footer={null}
      closable={modalState !== 'animation'}
      maskClosable={modalState !== 'animation'}
      onCancel={modalState === 'animation' ? undefined : onCancel}
      width={500}
      centered
    >
      {renderContent()}
    </Modal>
  )
}

export default PurchaseModal 