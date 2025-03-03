import React, { useState, useEffect } from 'react'
import { Card, Typography, Badge } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, GiftOutlined } from '@ant-design/icons'
import { EventInfo as EventInfoType } from '../../types'
import styles from './EventInfo.module.css'

const { Text } = Typography

interface EventInfoProps {
  eventInfo: EventInfoType
}

/**
 * 이벤트 정보 컴포넌트
 * 랜덤박스 이벤트 정보 및 남은 시간 표시
 */
const EventInfo: React.FC<EventInfoProps> = ({ eventInfo }) => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [eventStatus, setEventStatus] = useState<'active' | 'inactive' | 'scheduled'>('inactive')
  
  // 이벤트 상태 및 카운트다운 계산
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const startDate = new Date(eventInfo.startDate)
      const endDate = new Date(eventInfo.endDate)
      
      // 이벤트 상태 결정
      if (now < startDate) {
        setEventStatus('scheduled')
      } else if (now > endDate) {
        setEventStatus('inactive')
      } else {
        setEventStatus('active')
      }
      
      // 타임스탬프 계산
      let targetDate = endDate
      let diff = targetDate.getTime() - now.getTime()
      
      // 활성화되지 않은 이벤트는 시작까지 카운트다운
      if (eventStatus === 'scheduled') {
        targetDate = startDate
        diff = targetDate.getTime() - now.getTime()
      }
      
      // 종료된 이벤트는 카운트다운 0
      if (eventStatus === 'inactive') {
        diff = 0
      }
      
      // 카운트다운 계산
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        setCountdown({ days, hours, minutes, seconds })
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    
    return () => clearInterval(timer)
  }, [eventInfo, eventStatus])
  
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
  
  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  
  // 이벤트 상태에 따른 뱃지 렌더링
  const renderStatusBadge = () => {
    if (eventStatus === 'active') {
      return <Badge className={styles.statusBadge} status="success" text="진행 중" />
    } else if (eventStatus === 'scheduled') {
      return <Badge className={styles.statusBadge} status="warning" text="예정됨" />
    } else {
      return <Badge className={styles.statusBadge} status="error" text="종료됨" />
    }
  }
  
  // 카운트다운 타이머 렌더링
  const renderCountdown = () => {
    // 특별 케이스 처리: 이벤트가 종료된 경우
    if (eventStatus === 'inactive') {
      return <div className={styles.countdownValue}>이벤트가 종료되었습니다</div>
    }
    
    return (
      <div className={styles.countdownValue}>
        <div className={styles.countdownDigit}>{String(countdown.days).padStart(2, '0')}</div>
        <span className={styles.countdownSeparator}>:</span>
        <div className={styles.countdownDigit}>{String(countdown.hours).padStart(2, '0')}</div>
        <span className={styles.countdownSeparator}>:</span>
        <div className={styles.countdownDigit}>{String(countdown.minutes).padStart(2, '0')}</div>
        <span className={styles.countdownSeparator}>:</span>
        <div className={styles.countdownDigit}>{String(countdown.seconds).padStart(2, '0')}</div>
      </div>
    )
  }
  
  // 이벤트 규칙 렌더링
  const renderRules = () => {
    if (!eventInfo.rules || eventInfo.rules.length === 0) {
      return <Text>이벤트 규칙이 없습니다.</Text>
    }
    
    return (
      <ul className={styles.rulesList}>
        {eventInfo.rules.map((rule, index) => (
          <li key={index} className={styles.ruleItem}>{rule}</li>
        ))}
      </ul>
    )
  }
  
  return (
    <div className={styles.container}>
      {/* 배너 이미지 */}
      <div className={styles.banner}>
        {eventInfo.bannerUrl ? (
          <img 
            src={eventInfo.bannerUrl} 
            alt={eventInfo.title}
            className={styles.bannerImage}
          />
        ) : (
          <div className={styles.bannerDefault}>
            <div className={styles.bannerTitle}>{eventInfo.title}</div>
            <div className={styles.bannerSubtitle}>랜덤박스 이벤트</div>
          </div>
        )}
      </div>
      
      {/* 이벤트 헤더 정보 */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          {eventInfo.title}
          {renderStatusBadge()}
        </h1>
        <p className={styles.description}>{eventInfo.description}</p>
      </div>
      
      {/* 이벤트 기간 정보 */}
      <div className={styles.timeInfo}>
        <div className={styles.timeBlock}>
          <div className={styles.timeLabel}>
            <CalendarOutlined /> 시작일
          </div>
          <div className={styles.timeValue}>
            {formatDate(eventInfo.startDate)}
          </div>
        </div>
        
        <div className={styles.timeBlock}>
          <div className={styles.timeLabel}>
            <ClockCircleOutlined /> 시작 시간
          </div>
          <div className={styles.timeValue}>
            {formatTime(eventInfo.startDate)}
          </div>
        </div>
        
        <div className={styles.timeBlock}>
          <div className={styles.timeLabel}>
            <CalendarOutlined /> 종료일
          </div>
          <div className={styles.timeValue}>
            {formatDate(eventInfo.endDate)}
          </div>
        </div>
        
        <div className={styles.timeBlock}>
          <div className={styles.timeLabel}>
            <ClockCircleOutlined /> 종료 시간
          </div>
          <div className={styles.timeValue}>
            {formatTime(eventInfo.endDate)}
          </div>
        </div>
        
        <div className={styles.countdown}>
          <div className={styles.countdownLabel}>
            {eventStatus === 'active' ? '종료까지 남은 시간' : 
             eventStatus === 'scheduled' ? '시작까지 남은 시간' : '이벤트 종료'}
          </div>
          {renderCountdown()}
        </div>
      </div>
      
      {/* 이벤트 규칙 */}
      <Card 
        title="이벤트 규칙" 
        className={styles.card}
        extra={<GiftOutlined />}
      >
        {renderRules()}
      </Card>
    </div>
  )
}

export default EventInfo 