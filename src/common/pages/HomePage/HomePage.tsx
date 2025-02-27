import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'
import { Button, message } from 'antd'
import type { FeatureCard } from '../../types/navigation'
import { useState } from 'react'
import axios from 'axios'

const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'flash-deals',
    title: '플래시딜 관리',
    description: '한정된 시간 동안 진행되는 특별 할인 이벤트를 관리합니다.',
    path: '/flash-deals',
    icon: 'flash_on',
    backgroundColor: '#E8F5E9'
  },
  {
    id: 'raffles',
    title: '럭키드로우 이벤트',
    description: '추첨을 통한 상품 증정 이벤트를 관리합니다.',
    path: '/raffles',
    icon: 'card_giftcard',
    backgroundColor: '#E3F2FD'
  },
  {
    id: 'random-picker',
    title: '랜덤 뽑기 이벤트',
    description: '랜덤 뽑기 이벤트를 관리합니다.',
    path: '/random-picker',
    icon: 'analytics',
    backgroundColor: '#F2F6D0'
  },
  {
    id: 'attendance-check',
    title: '출석체크 관리',
    description: '출석체크 이벤트를 관리합니다.',
    path: '/attendance',
    icon: 'schedule',
    backgroundColor: '#FCEEE3'
  },
  {
    id: 'time-attack',
    title: '타임어택 관리',
    description: '지정된 시간대별로 다양한 할인 상품을 관리합니다.',
    path: '/time-attack',
    icon: 'schedule',
    backgroundColor: '#FFF3E0'
  },
  {
    id: 'group-deals',
    title: '공동구매 관리',
    description: '여러 사용자가 모여 할인된 가격으로 구매하는 이벤트를 관리합니다.',
    path: '/group-deals',
    icon: 'group',
    backgroundColor: '#E8EAF6'
  },
  {
    id: 'limited-deals',
    title: '한정판매 관리',
    description: '수량이 제한된 특별 상품의 판매 이벤트를 관리합니다.',
    path: '/limited-deals',
    icon: 'inventory',
    backgroundColor: '#F8F3D9'
  },
  {
    id: 'analytics',
    title: '이벤트 분석',
    description: '진행된 이벤트의 성과를 분석하고 인사이트를 도출합니다.',
    path: '/analytics',
    icon: 'analytics',
    backgroundColor: '#F3E5F5'
  }
]

const TestErrorButton = () => {
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const testNetworkError = async () => {
    setLoading(true)
    try {
      // 존재하지 않는 엔드포인트로 요청
      await axios.get('http://localhost:3000/non-existent')
    } catch (error) {
      console.log('Error caught:', error)
      messageApi.error('네트워크 에러가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <Button 
        onClick={testNetworkError}
        loading={loading}
        danger
      >
        네트워크 에러 테스트
      </Button>
    </>
  )
}

const HomePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>이벤트 플랫폼 관리 시스템</h1>
        <p className={styles.subtitle}>
          다양한 이벤트를 효율적으로 관리하고 분석할 수 있습니다.
        </p>
      </div>

      <div className={styles.grid}>
        {FEATURE_CARDS.map(card => (
          <Link
            key={card.id}
            to={card.path}
            className={styles.card}
            style={{ backgroundColor: card.backgroundColor }}
          >
            <div className={styles.cardHeader}>
              <span className={`material-icons ${styles.icon}`}>{card.icon}</span>
              <h2 className={styles.cardTitle}>{card.title}</h2>
            </div>
            <p className={styles.cardDescription}>{card.description}</p>
            <div className={styles.cardFooter}>
              <span>바로가기</span>
              <span className={`material-icons ${styles.arrowIcon}`}>arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.testButton}>
        <TestErrorButton />
      </div>
    </div>
  )
}

export default HomePage
