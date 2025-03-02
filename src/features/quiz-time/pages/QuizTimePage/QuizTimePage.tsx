import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Card, Button, Row, Col, Spin, Empty, Tabs, Input, Select, Badge } from 'antd';
import { SearchOutlined, TrophyOutlined, GiftOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useQuizzes, useQuizResults } from '../../hooks';
import { QUIZ_CATEGORIES, DIFFICULTY_LEVELS } from '../../constants';
import styles from './QuizTimePage.module.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

/**
 * QuizTimePage component
 * Main landing page for the Quiz Time feature
 */
const QuizTimePage: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    quizzes,
    filteredQuizzes,
    isLoading,
    error,
    filterByCategory,
    filterByDifficulty,
    searchQuizzes,
    selectedCategory,
    selectedDifficulty,
    refreshQuizzes
  } = useQuizzes();
  
  const { results } = useQuizResults();
  
  // Fetch quizzes on initial render
  useEffect(() => {
    refreshQuizzes();
  }, [refreshQuizzes]);
  
  // Compute completion stats
  const completedQuizzes = results.length;
  const totalQuizzes = quizzes.length;
  const completionPercentage = totalQuizzes ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0;
  
  // Handle starting a quiz
  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz-time/play/${quizId}`);
  };
  
  // Handle navigating to results page
  const handleViewResults = () => {
    navigate('/quiz-time/results');
  };
  
  // Handle navigating to rewards page
  const handleViewRewards = () => {
    navigate('/quiz-time/rewards');
  };
  
  // Render quiz card
  const renderQuizCard = (quiz: any) => {
    const isCompleted = results.some(result => result.quizId === quiz.id);
    
    return (
      <Col xs={24} sm={12} md={8} lg={8} xl={6} key={quiz.id}>
        <Badge.Ribbon 
          text={isCompleted ? "Completed" : quiz.difficulty} 
          color={isCompleted ? "green" : getDifficultyColor(quiz.difficulty)}
        >
          <Card 
            className={styles.quizCard}
            hoverable
            cover={
              <div className={styles.quizCardCover}>
                <div className={styles.quizCategory}>{getCategoryLabel(quiz.category)}</div>
                {isCompleted && <div className={styles.completedBadge}><TrophyOutlined /></div>}
              </div>
            }
            actions={[
              <Button 
                type="primary" 
                onClick={() => handleStartQuiz(quiz.id)}
                disabled={isLoading}
              >
                {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
              </Button>
            ]}
          >
            <Card.Meta
              title={quiz.title}
              description={
                <>
                  <Paragraph ellipsis={{ rows: 2 }}>{quiz.description}</Paragraph>
                  <div className={styles.quizMeta}>
                    <Text type="secondary"><ClockCircleOutlined /> {quiz.timeLimit}s</Text>
                    <Text type="secondary">{quiz.totalQuestions} Questions</Text>
                  </div>
                  {quiz.rewards.length > 0 && (
                    <div className={styles.rewardsPreview}>
                      <GiftOutlined /> {quiz.rewards.length} rewards available
                    </div>
                  )}
                </>
              }
            />
          </Card>
        </Badge.Ribbon>
      </Col>
    );
  };
  
  // Helper function to get category label
  const getCategoryLabel = (categoryKey: string) => {
    const categories: Record<string, string> = {
      [QUIZ_CATEGORIES.PRODUCT]: 'Product Knowledge',
      [QUIZ_CATEGORIES.GENERAL_KNOWLEDGE]: 'General Knowledge',
      [QUIZ_CATEGORIES.SEASONAL]: 'Seasonal',
      [QUIZ_CATEGORIES.PROMOTIONAL]: 'Promotional'
    };
    
    return categories[categoryKey] || categoryKey;
  };
  
  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      [DIFFICULTY_LEVELS.EASY]: 'blue',
      [DIFFICULTY_LEVELS.MEDIUM]: 'orange',
      [DIFFICULTY_LEVELS.HARD]: 'red'
    };
    
    return colors[difficulty] || 'blue';
  };
  
  return (
    <div className={styles.quizTimePage}>
      <div className={styles.header}>
        <Title level={2}>Quiz Time</Title>
        <Paragraph>
          Test your knowledge, earn rewards, and have fun with our interactive quizzes!
        </Paragraph>
        
        <div className={styles.stats}>
          <Card className={styles.statCard}>
            <Statistic 
              title="Quizzes Completed" 
              value={completedQuizzes} 
              suffix={`/ ${totalQuizzes}`}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
          <Card className={styles.statCard}>
            <Statistic 
              title="Completion Rate" 
              value={completionPercentage} 
              suffix="%" 
              precision={0}
              valueStyle={{ color: completionPercentage > 50 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </div>
      </div>
      
      <div className={styles.actions}>
        <Button type="default" onClick={handleViewResults} icon={<TrophyOutlined />}>
          View Results
        </Button>
        <Button type="default" onClick={handleViewRewards} icon={<GiftOutlined />}>
          My Rewards
        </Button>
      </div>
      
      <div className={styles.filters}>
        <Input
          placeholder="Search quizzes"
          prefix={<SearchOutlined />}
          onChange={(e) => searchQuizzes(e.target.value)}
          allowClear
          className={styles.searchInput}
        />
        
        <Select
          placeholder="Category"
          onChange={(value) => filterByCategory(value)}
          value={selectedCategory}
          allowClear
          className={styles.filterSelect}
        >
          {Object.entries(QUIZ_CATEGORIES).map(([key, value]) => (
            <Option key={value} value={value}>{getCategoryLabel(value)}</Option>
          ))}
        </Select>
        
        <Select
          placeholder="Difficulty"
          onChange={(value) => filterByDifficulty(value)}
          value={selectedDifficulty}
          allowClear
          className={styles.filterSelect}
        >
          {Object.entries(DIFFICULTY_LEVELS).map(([key, value]) => (
            <Option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</Option>
          ))}
        </Select>
      </div>
      
      <Tabs defaultActiveKey="all" className={styles.tabs}>
        <TabPane tab="All Quizzes" key="all">
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
              <Text>Loading quizzes...</Text>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <Text type="danger">{error}</Text>
              <Button onClick={refreshQuizzes}>Retry</Button>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <Empty 
              description="No quizzes found" 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
            />
          ) : (
            <Row gutter={[16, 16]} className={styles.quizGrid}>
              {filteredQuizzes.map(renderQuizCard)}
            </Row>
          )}
        </TabPane>
        
        <TabPane tab="Completed" key="completed">
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
              <Text>Loading quizzes...</Text>
            </div>
          ) : (
            <Row gutter={[16, 16]} className={styles.quizGrid}>
              {filteredQuizzes
                .filter(quiz => results.some(result => result.quizId === quiz.id))
                .map(renderQuizCard)
              }
            </Row>
          )}
        </TabPane>
        
        <TabPane tab="Not Completed" key="not-completed">
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
              <Text>Loading quizzes...</Text>
            </div>
          ) : (
            <Row gutter={[16, 16]} className={styles.quizGrid}>
              {filteredQuizzes
                .filter(quiz => !results.some(result => result.quizId === quiz.id))
                .map(renderQuizCard)
              }
            </Row>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

const Statistic = ({ title, value, suffix, precision, valueStyle }: any) => {
  return (
    <div className={styles.statistic}>
      <div className={styles.statisticTitle}>{title}</div>
      <div className={styles.statisticValue} style={valueStyle}>
        {typeof value === 'number' && precision !== undefined
          ? value.toFixed(precision)
          : value}
        {suffix && <span className={styles.statisticSuffix}>{suffix}</span>}
      </div>
    </div>
  );
};

export default QuizTimePage; 