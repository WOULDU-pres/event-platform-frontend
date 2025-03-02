import React from 'react';
import { Card, Typography, Button, Divider, Tag, Descriptions, Space } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import styles from './EventInfo.module.css';
import { Quiz, EventInfo as EventInfoType } from '../../types';

const { Title, Text, Paragraph } = Typography;

export interface EventInfoProps {
  quiz: Quiz;
  eventInfo?: EventInfoType;
  isEnrolled?: boolean;
  isParticipating?: boolean;
  isCompleted?: boolean;
  onParticipate?: () => void;
  onViewResults?: () => void;
  className?: string;
}

const EventInfo: React.FC<EventInfoProps> = ({
  quiz,
  eventInfo,
  isEnrolled = false,
  isParticipating = false,
  isCompleted = false,
  onParticipate,
  onViewResults,
  className,
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time in minutes
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}분`;
  };

  // Determine the event status
  const getEventStatus = () => {
    if (!eventInfo) return { text: '진행 중', color: 'green' };

    const now = new Date();
    const startDate = new Date(eventInfo.startDate);
    const endDate = new Date(eventInfo.endDate);

    if (now < startDate) {
      return { text: '예정됨', color: 'blue' };
    } else if (now >= startDate && now <= endDate) {
      return { text: '진행 중', color: 'green' };
    } else {
      return { text: '종료됨', color: 'red' };
    }
  };

  const eventStatus = getEventStatus();

  return (
    <Card className={`${styles.eventInfoCard} ${className}`}>
      <div className={styles.headerSection}>
        <Title level={3} className={styles.title}>{quiz.title}</Title>
        <Tag color={eventStatus.color} className={styles.statusTag}>
          {eventStatus.text}
        </Tag>
      </div>

      <Paragraph className={styles.description}>
        {quiz.description}
      </Paragraph>

      <Divider className={styles.divider} />
      
      <Descriptions column={{ xs: 1, sm: 2 }} className={styles.details}>
        {eventInfo && (
          <>
            <Descriptions.Item 
              label={<Space><CalendarOutlined /> 시작일</Space>}
              className={styles.detailItem}
            >
              {formatDate(eventInfo.startDate)}
            </Descriptions.Item>
            
            <Descriptions.Item 
              label={<Space><CalendarOutlined /> 종료일</Space>}
              className={styles.detailItem}
            >
              {formatDate(eventInfo.endDate)}
            </Descriptions.Item>
          </>
        )}
        
        <Descriptions.Item 
          label={<Space><ClockCircleOutlined /> 제한 시간</Space>}
          className={styles.detailItem}
        >
          {quiz.timeLimit ? formatTime(quiz.timeLimit) : '제한 없음'}
        </Descriptions.Item>
        
        <Descriptions.Item 
          label={<Space><QuestionCircleOutlined /> 문제 수</Space>}
          className={styles.detailItem}
        >
          {quiz.totalQuestions}개 문제
        </Descriptions.Item>
        
        <Descriptions.Item 
          label={<Space><TrophyOutlined /> 보상</Space>}
          className={styles.detailItem}
        >
          {quiz.rewards?.length > 0 ? '있음' : '없음'}
        </Descriptions.Item>
        
        <Descriptions.Item 
          label={<Space><UserOutlined /> 카테고리</Space>}
          className={styles.detailItem}
        >
          {quiz.category}
        </Descriptions.Item>
      </Descriptions>

      <Divider className={styles.divider} />

      <div className={styles.actionSection}>
        {!isEnrolled && !isCompleted && (
          <Button 
            type="primary" 
            size="large" 
            onClick={onParticipate}
            disabled={eventStatus.text === '종료됨'}
            className={styles.actionButton}
          >
            참가하기
          </Button>
        )}
        
        {isEnrolled && !isCompleted && (
          <Button 
            type="primary" 
            size="large" 
            onClick={onParticipate}
            className={styles.actionButton}
          >
            {isParticipating ? '계속하기' : '시작하기'}
          </Button>
        )}
        
        {isCompleted && (
          <Button 
            type="default" 
            size="large" 
            onClick={onViewResults}
            className={styles.actionButton}
          >
            결과 보기
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EventInfo; 