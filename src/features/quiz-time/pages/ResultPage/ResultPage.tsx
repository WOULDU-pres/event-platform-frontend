import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, Card, Button, Progress, Spin, Result, 
  Divider, List, Badge, Tag, Row, Col, Collapse, Statistic 
} from 'antd';
import { 
  CheckCircleOutlined, CloseCircleOutlined,
  HomeOutlined, GiftOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { useQuizResults, useRewards } from '../../hooks';
import styles from './ResultPage.module.css';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

/**
 * ResultPage component
 * Page for displaying quiz results
 */
const ResultPage: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(false);
  
  const { results, isLoading, error, getResultById } = useQuizResults();
  const { rewards, redeemReward } = useRewards();
  
  const result = resultId ? getResultById(resultId) : results[0];
  
  // Handle navigation to rewards page
  const handleViewRewards = () => {
    navigate('/quiz-time/rewards');
  };
  
  // Handle navigation to home page
  const handleBackToHome = () => {
    navigate('/quiz-time');
  };
  
  // Handle reward redemption
  const handleRedeemReward = (rewardId: string) => {
    redeemReward(rewardId).then(() => {
      // Show success message or update UI
      console.log(`Reward ${rewardId} redeemed successfully`);
    });
  };
  
  // Helper function to get question result icon
  const getQuestionResultIcon = (isCorrect: boolean) => {
    return isCorrect 
      ? <CheckCircleOutlined className={styles.correctIcon} />
      : <CloseCircleOutlined className={styles.incorrectIcon} />;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <Text>Loading results...</Text>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load results"
        subTitle={error}
        extra={[
          <Button type="primary" key="back" onClick={handleBackToHome}>
            Back to Quiz Time
          </Button>
        ]}
      />
    );
  }
  
  // Render no result found
  if (!result) {
    return (
      <Result
        status="404"
        title="Result not found"
        subTitle="The quiz result you're looking for doesn't exist."
        extra={[
          <Button type="primary" key="back" onClick={handleBackToHome}>
            Back to Quiz Time
          </Button>
        ]}
      />
    );
  }
  
  // Calculate stats
  const totalQuestions = result.answers.length;
  const correctAnswers = result.answers.filter(answer => answer.isCorrect).length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isPassed = scorePercentage >= (result.quiz.passingScore ?? 0);

  // Filter earned rewards
  const earnedRewards = rewards.filter(reward => 
    result.earnedRewardIds && result.earnedRewardIds.includes(reward.id)
  );
  
  return (
    <div className={styles.resultPage}>
      <div className={styles.header}>
        <Title level={3}>Quiz Results</Title>
        <Paragraph>{result.quiz.title}</Paragraph>
      </div>
      
      <Card className={styles.scoreCard}>
        <div className={styles.scoreContainer}>
          <div className={styles.scoreCircle}>
            <Progress
              type="circle"
              percent={scorePercentage}
              format={() => `${scorePercentage}%`}
              strokeColor={isPassed ? '#52c41a' : '#f5222d'}
              width={120}
            />
          </div>
          
          <div className={styles.scoreInfo}>
            <Title level={4}>
              {isPassed 
                ? <Badge status="success" text="Passed" /> 
                : <Badge status="error" text="Failed" />
              }
            </Title>
            <Text>You answered {correctAnswers} out of {totalQuestions} questions correctly.</Text>
            <Text type="secondary">Passing score: {result.quiz.passingScore}%</Text>
            
            <div className={styles.timeTaken}>
              <Text type="secondary">Time taken: {formatTime(result.timeTaken)}</Text>
            </div>
          </div>
        </div>
        
        <Divider />
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Statistic
              title="Score"
              value={result.score}
              suffix={`/ ${result.quiz.totalPoints || totalQuestions * 10}`}
              valueStyle={{ color: isPassed ? '#3f8600' : '#cf1322' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Correct Answers"
              value={correctAnswers}
              suffix={`/ ${totalQuestions}`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Time Taken"
              value={formatTime(result.timeTaken)}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>
      
      {earnedRewards.length > 0 && (
        <div className={styles.rewardsSection}>
          <Title level={4}>
            <GiftOutlined /> Rewards Earned
          </Title>
          
          <div className={styles.rewardsList}>
            {earnedRewards.map(reward => (
              <Card key={reward.id} className={styles.rewardCard}>
                <div className={styles.rewardInfo}>
                  <div>
                    <Text strong>{reward.title}</Text>
                    <Paragraph>{reward.description}</Paragraph>
                    <div className={styles.rewardMeta}>
                      <Tag color="gold">{reward.type}</Tag>
                      <Tag color={reward.isRedeemed ? 'green' : 'blue'}>
                        {reward.isRedeemed ? 'Redeemed' : 'Available'}
                      </Tag>
                    </div>
                  </div>
                  {!reward.isRedeemed && (
                    <Button 
                      type="primary" 
                      onClick={() => handleRedeemReward(reward.id)}
                    >
                      Redeem
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <div className={styles.viewRewardsAction}>
            <Button icon={<GiftOutlined />} onClick={handleViewRewards}>
              View All Rewards
            </Button>
          </div>
        </div>
      )}
      
      <div className={styles.answersSection}>
        <div className={styles.answersSectionHeader}>
          <Title level={4}>
            Question Summary
          </Title>
          <Button 
            type="link" 
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </Button>
        </div>
        
        <List
          className={styles.questionsList}
          itemLayout="horizontal"
          dataSource={result.answers}
          renderItem={(answer, index) => (
            <List.Item>
              <Card 
                className={styles.questionResultCard}
                title={
                  <div className={styles.questionResultHeader}>
                    <div className={styles.questionNumber}>
                      Question {index + 1}
                    </div>
                    {getQuestionResultIcon(answer.isCorrect)}
                  </div>
                }
                extra={
                  <div className={styles.pointsAwarded}>
                    {answer.pointsAwarded || 0} / {answer.question.points || 10} points
                  </div>
                }
              >
                <div>
                  <Text strong>{answer.question.questionText}</Text>
                  
                  {showAnswers && (
                    <div className={styles.answersDetail}>
                      <Paragraph type="secondary">Your answer:</Paragraph>
                      <div className={styles.userAnswer}>
                        <Tag color={answer.isCorrect ? 'green' : 'red'}>
                          {answer.selectedAnswer.text}
                        </Tag>
                      </div>
                      
                      {!answer.isCorrect && (
                        <div className={styles.correctAnswer}>
                          <Paragraph type="secondary">Correct answer:</Paragraph>
                          <Tag color="green">
                            {answer.question.answers?.find(a => a.isCorrect)?.text}
                          </Tag>
                        </div>
                      )}
                      
                      {answer.question.explanation && (
                        <div className={styles.explanation}>
                          <Collapse ghost>
                            <Panel 
                              header={
                                <Text type="secondary">
                                  <InfoCircleOutlined /> Explanation
                                </Text>
                              } 
                              key="1"
                            >
                              <Paragraph>{answer.question.explanation}</Paragraph>
                            </Panel>
                          </Collapse>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
      
      <div className={styles.actions}>
        <Button type="default" icon={<HomeOutlined />} onClick={handleBackToHome}>
          Back to Quiz Time
        </Button>
        {earnedRewards.length > 0 && (
          <Button type="primary" icon={<GiftOutlined />} onClick={handleViewRewards}>
            Manage Rewards
          </Button>
        )}
      </div>
    </div>
  );
};

// Helper function to format time in minutes and seconds
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export default ResultPage; 