import React, { useState } from 'react';
import { List, Typography, Card, Tag, Button, Empty, Spin, Input } from 'antd';
import { 
  SearchOutlined, 
  TrophyOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  RightOutlined
} from '@ant-design/icons';
import { QuizResult } from '../../types';
import styles from './QuizHistory.module.css';

const { Title, Text } = Typography;
const { Search } = Input;

export interface QuizHistoryProps {
  results: QuizResult[];
  isLoading?: boolean;
  onViewResult?: (resultId: string) => void;
}

/**
 * QuizHistory component
 * Displays a list of previous quiz results
 */
const QuizHistory: React.FC<QuizHistoryProps> = ({
  results,
  isLoading = false,
  onViewResult
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter results based on search query
  const filteredResults = results.filter(result => {
    if (!searchQuery.trim()) return true;
    
    const quizTitle = result.quiz?.title || '';
    const resultId = result.resultId;
    const date = new Date(result.completedAt).toLocaleDateString();
    
    return (
      quizTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resultId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      date.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Sort results by completion date (newest first)
  const sortedResults = [...filteredResults].sort((a, b) => {
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format time spent
  const formatTimeSpent = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <div className={styles.quizHistory}>
      <div className={styles.header}>
        <Title level={4}>Quiz History</Title>
        <Search
          placeholder="Search quiz results"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={setSearchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text>Loading quiz history...</Text>
        </div>
      ) : sortedResults.length === 0 ? (
        <Empty
          description={
            searchQuery
              ? 'No results match your search'
              : 'No quiz results yet. Start taking quizzes to see your history!'
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          className={styles.resultsList}
          dataSource={sortedResults}
          renderItem={(result) => {
            // Calculate score percentage
            const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
            const isPassed = scorePercentage >= 70; // Assuming 70% is passing score
            
            return (
              <List.Item>
                <Card 
                  className={styles.resultCard}
                  hoverable
                  onClick={() => onViewResult && onViewResult(result.resultId)}
                >
                  <div className={styles.resultHeader}>
                    <div>
                      <Title level={5} className={styles.quizTitle}>
                        {result.quiz?.title || 'Untitled Quiz'}
                      </Title>
                      <Text type="secondary" className={styles.completedDate}>
                        Completed on {formatDate(result.completedAt)}
                      </Text>
                    </div>
                    
                    <Tag color={isPassed ? 'success' : 'error'} className={styles.scoreTag}>
                      {scorePercentage}%
                    </Tag>
                  </div>
                  
                  <div className={styles.resultStats}>
                    <div className={styles.statItem}>
                      <CheckCircleOutlined className={styles.statIcon} />
                      <Text>{result.correctAnswers}/{result.totalQuestions} correct</Text>
                    </div>
                    
                    <div className={styles.statItem}>
                      <ClockCircleOutlined className={styles.statIcon} />
                      <Text>{formatTimeSpent(result.timeSpent)}</Text>
                    </div>
                    
                    {result.rewards && result.rewards.length > 0 && (
                      <div className={styles.statItem}>
                        <TrophyOutlined className={styles.statIcon} />
                        <Text>{result.rewards.length} rewards</Text>
                      </div>
                    )}
                  </div>
                  
                  {onViewResult && (
                    <div className={styles.viewDetails}>
                      <Button 
                        type="link" 
                        size="small"
                        className={styles.viewButton}
                      >
                        View Details <RightOutlined />
                      </Button>
                    </div>
                  )}
                </Card>
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
};

export default QuizHistory; 