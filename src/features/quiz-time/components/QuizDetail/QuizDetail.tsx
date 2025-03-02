import React from 'react';
import { Card, Typography, Button, Tag, Divider, Statistic, Row, Col, Space, List } from 'antd';
import { 
  QuestionCircleOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined,
  UserOutlined,
  FireOutlined,
  StarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Quiz, Reward } from '../../types';
import styles from './QuizDetail.module.css';

const { Title, Text, Paragraph } = Typography;

export interface QuizDetailProps {
  quiz: Quiz;
  userStats?: {
    hasCompleted: boolean;
    bestScore?: number;
    attempts?: number;
    lastAttemptDate?: string;
  };
  onStart?: () => void;
  onViewHistory?: () => void;
  className?: string;
}

/**
 * QuizDetail component
 * Displays detailed information about a quiz
 */
const QuizDetail: React.FC<QuizDetailProps> = ({
  quiz,
  userStats,
  onStart,
  onViewHistory,
  className,
}) => {
  // Format difficulty label and color
  const getDifficultyInfo = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return { label: 'Easy', color: 'green' };
      case 'medium':
        return { label: 'Medium', color: 'orange' };
      case 'hard':
        return { label: 'Hard', color: 'red' };
      default:
        return { label: difficulty, color: 'blue' };
    }
  };
  
  // Format time limit
  const formatTimeLimit = (seconds: number): string => {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes}분`;
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const difficultyInfo = getDifficultyInfo(quiz.difficulty);
  
  return (
    <div className={`${styles.quizDetail} ${className || ''}`}>
      <Card className={styles.detailCard}>
        <div className={styles.header}>
          <Title level={3} className={styles.title}>{quiz.title}</Title>
          <Tag color={difficultyInfo.color} className={styles.difficultyTag}>
            {difficultyInfo.label}
          </Tag>
        </div>
        
        <Paragraph className={styles.description}>
          {quiz.description}
        </Paragraph>
        
        <Divider className={styles.divider} />
        
        <Row gutter={[32, 24]} className={styles.statsRow}>
          <Col xs={12} sm={8} md={6}>
            <Statistic 
              title="Questions" 
              value={quiz.totalQuestions} 
              prefix={<QuestionCircleOutlined />} 
              className={styles.statistic}
            />
          </Col>
          
          <Col xs={12} sm={8} md={6}>
            <Statistic 
              title="Time Limit" 
              value={formatTimeLimit(quiz.timeLimit)} 
              prefix={<ClockCircleOutlined />} 
              className={styles.statistic}
            />
          </Col>
          
          <Col xs={12} sm={8} md={6}>
            <Statistic 
              title="Category" 
              value={quiz.category} 
              prefix={<StarOutlined />} 
              className={styles.statistic}
            />
          </Col>
          
          {userStats?.attempts !== undefined && (
            <Col xs={12} sm={8} md={6}>
              <Statistic 
                title="Your Attempts" 
                value={userStats.attempts} 
                prefix={<UserOutlined />} 
                className={styles.statistic}
              />
            </Col>
          )}
          
          {userStats?.bestScore !== undefined && (
            <Col xs={12} sm={8} md={6}>
              <Statistic 
                title="Your Best Score" 
                value={`${userStats.bestScore}%`}
                prefix={<TrophyOutlined />} 
                valueStyle={{ color: userStats.bestScore >= 70 ? '#52c41a' : '#faad14' }}
                className={styles.statistic}
              />
            </Col>
          )}
        </Row>
        
        {quiz.rewards && quiz.rewards.length > 0 && (
          <div className={styles.rewardsSection}>
            <Divider orientation="left">
              <Space>
                <TrophyOutlined />
                Rewards
              </Space>
            </Divider>
            
            <List
              className={styles.rewardsList}
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
              dataSource={quiz.rewards}
              renderItem={(reward: Reward) => (
                <List.Item>
                  <Card size="small" className={styles.rewardCard}>
                    <div className={styles.rewardHeader}>
                      <Tag color="gold">{reward.type}</Tag>
                      <Text strong className={styles.rewardValue}>
                        {reward.type === 'discount' ? `${reward.value}%` : reward.value}
                      </Text>
                    </div>
                    <Text className={styles.rewardName}>{reward.name}</Text>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}
        
        <div className={styles.actionSection}>
          {userStats?.hasCompleted && (
            <Tag icon={<CheckCircleOutlined />} color="success" className={styles.completedTag}>
              You have completed this quiz
            </Tag>
          )}
          
          <div className={styles.buttons}>
            {onViewHistory && userStats?.attempts && userStats.attempts > 0 && (
              <Button onClick={onViewHistory}>
                View History
              </Button>
            )}
            
            <Button 
              type="primary" 
              icon={<FireOutlined />} 
              size="large"
              onClick={onStart}
              className={styles.startButton}
            >
              {userStats?.hasCompleted ? 'Try Again' : 'Start Quiz'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizDetail; 