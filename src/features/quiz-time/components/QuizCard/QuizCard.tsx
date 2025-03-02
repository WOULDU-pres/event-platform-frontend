import React from 'react';
import { Card, Typography, Button, Tag, Space, Progress } from 'antd';
import { 
  ClockCircleOutlined, 
  QuestionCircleOutlined,
  TrophyOutlined,
  RightOutlined,
  FireOutlined
} from '@ant-design/icons';
import { Quiz } from '../../types';
import styles from './QuizCard.module.css';

const { Title, Text, Paragraph } = Typography;

export interface QuizCardProps {
  quiz: Quiz;
  isCompleted?: boolean;
  completionPercentage?: number;
  onStart?: (quizId: string) => void;
  className?: string;
}

/**
 * QuizCard component
 * Displays a summary of a quiz with basic information and actions
 */
const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  isCompleted = false,
  completionPercentage = 0,
  onStart,
  className,
}) => {
  // Get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'red';
      default:
        return 'blue';
    }
  };

  // Format time limit to minutes
  const formatTimeLimit = (seconds: number): string => {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes}분`;
  };

  return (
    <Card 
      className={`${styles.quizCard} ${className || ''} ${isCompleted ? styles.completed : ''}`}
      hoverable
    >
      {/* Completion badge for completed quizzes */}
      {isCompleted && (
        <div className={styles.completionBadge}>
          <Text>완료됨</Text>
        </div>
      )}
      
      {/* In-progress indicator */}
      {!isCompleted && completionPercentage > 0 && (
        <div className={styles.progressIndicator}>
          <Progress 
            percent={completionPercentage} 
            size="small" 
            status="active" 
            showInfo={false}
          />
          <Text className={styles.progressText}>진행 중 {completionPercentage}%</Text>
        </div>
      )}
      
      <div className={styles.cardHeader}>
        <Title level={4} className={styles.title}>{quiz.title}</Title>
        <Tag color={getDifficultyColor(quiz.difficulty)} className={styles.difficultyTag}>
          {quiz.difficulty}
        </Tag>
      </div>
      
      <Paragraph className={styles.description} ellipsis={{ rows: 2 }}>
        {quiz.description}
      </Paragraph>
      
      <div className={styles.quizMeta}>
        <Space className={styles.metaItem}>
          <QuestionCircleOutlined />
          <Text>{quiz.totalQuestions}개 문제</Text>
        </Space>
        
        <Space className={styles.metaItem}>
          <ClockCircleOutlined />
          <Text>{formatTimeLimit(quiz.timeLimit)}</Text>
        </Space>
        
        {quiz.rewards && quiz.rewards.length > 0 && (
          <Space className={styles.metaItem}>
            <TrophyOutlined />
            <Text>{quiz.rewards.length}개 보상</Text>
          </Space>
        )}
      </div>
      
      <div className={styles.actionArea}>
        <Button 
          type="primary"
          onClick={() => onStart && onStart(quiz.id)}
          className={styles.startButton}
          icon={isCompleted ? <RightOutlined /> : <FireOutlined />}
        >
          {isCompleted ? '결과 보기' : completionPercentage > 0 ? '계속하기' : '시작하기'}
        </Button>
      </div>
    </Card>
  );
};

export default QuizCard;