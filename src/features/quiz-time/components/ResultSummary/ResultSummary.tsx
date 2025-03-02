import React from 'react';
import { Typography, Progress, Card, Button, Row, Col, Tag, Divider } from 'antd';
import { 
  TrophyOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { QuizResult, Reward } from '../../types';
import styles from './ResultSummary.module.css';

const { Title, Text, Paragraph } = Typography;

export interface ResultSummaryProps {
  result: QuizResult;
  showDetails?: boolean;
  rewards?: Reward[];
  onViewAllResults?: () => void;
  onViewRewards?: () => void;
  onRetryQuiz?: () => void;
}

/**
 * ResultSummary component
 * Displays a summary of quiz results
 */
const ResultSummary: React.FC<ResultSummaryProps> = ({
  result,
  showDetails = true,
  rewards = [],
  onViewAllResults,
  onViewRewards,
  onRetryQuiz
}) => {
  // Calculate score percentage
  const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const isPassed = scorePercentage >= 70; // Assuming 70% is passing score
  
  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <div className={styles.resultSummary}>
      <Card className={styles.resultCard}>
        <div className={styles.header}>
          <Title level={4} className={styles.title}>
            {isPassed ? 'Congratulations!' : 'Quiz Completed'}
          </Title>
          {isPassed ? (
            <TrophyOutlined className={styles.trophyIcon} />
          ) : (
            <div className={styles.encouragement}>
              <Text>Keep trying! You'll do better next time.</Text>
            </div>
          )}
        </div>
        
        <div className={styles.scoreSection}>
          <div className={styles.scoreCircle}>
            <Progress
              type="circle"
              percent={scorePercentage}
              status={isPassed ? 'success' : 'exception'}
              width={120}
              format={() => (
                <div className={styles.scoreValue}>
                  <span>{scorePercentage}%</span>
                </div>
              )}
            />
          </div>
          
          <div className={styles.scoreDetails}>
            <Row gutter={[16, 16]}>
              <Col span={24} md={8}>
                <div className={styles.statItem}>
                  <CheckCircleOutlined className={styles.statIconCorrect} />
                  <Text strong>{result.correctAnswers}</Text>
                  <Text type="secondary">Correct</Text>
                </div>
              </Col>
              
              <Col span={24} md={8}>
                <div className={styles.statItem}>
                  <CloseCircleOutlined className={styles.statIconIncorrect} />
                  <Text strong>{result.totalQuestions - result.correctAnswers}</Text>
                  <Text type="secondary">Incorrect</Text>
                </div>
              </Col>
              
              <Col span={24} md={8}>
                <div className={styles.statItem}>
                  <ClockCircleOutlined className={styles.statIconTime} />
                  <Text strong>{formatTime(result.timeSpent)}</Text>
                  <Text type="secondary">Time Taken</Text>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        
        {rewards && rewards.length > 0 && (
          <div className={styles.rewardsSection}>
            <Divider>
              <GiftOutlined /> Rewards Earned
            </Divider>
            
            <div className={styles.rewardsList}>
              {rewards.map((reward) => (
                <Tag 
                  key={reward.id} 
                  color="gold" 
                  className={styles.rewardTag}
                >
                  {reward.name}: {reward.value} {reward.type}
                </Tag>
              ))}
              
              {onViewRewards && (
                <Button 
                  type="link" 
                  onClick={onViewRewards}
                  className={styles.viewAllButton}
                >
                  View All Rewards
                </Button>
              )}
            </div>
          </div>
        )}
        
        {showDetails && (
          <div className={styles.extraDetails}>
            <Paragraph className={styles.completionMessage}>
              You completed the quiz on{' '}
              <Text strong>{new Date(result.completedAt).toLocaleString()}</Text>
            </Paragraph>
          </div>
        )}
        
        <div className={styles.actions}>
          {onRetryQuiz && (
            <Button onClick={onRetryQuiz}>
              Try Again
            </Button>
          )}
          
          {onViewAllResults && (
            <Button type="primary" onClick={onViewAllResults}>
              View All Results
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ResultSummary; 