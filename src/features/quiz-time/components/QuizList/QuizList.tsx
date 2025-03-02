import React, { useState } from 'react';
import { Typography, Row, Col, Empty, Spin, Input, Select, Divider } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Quiz } from '../../types';
import QuizCard from '../QuizCard';
import styles from './QuizList.module.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export interface QuizListProps {
  quizzes: Quiz[];
  completedQuizIds?: string[];
  quizProgress?: Record<string, number>; // quizId -> percentage
  isLoading?: boolean;
  onStartQuiz?: (quizId: string) => void;
  className?: string;
}

/**
 * QuizList component
 * Displays a filterable and searchable list of quizzes
 */
const QuizList: React.FC<QuizListProps> = ({
  quizzes,
  completedQuizIds = [],
  quizProgress = {},
  isLoading = false,
  onStartQuiz,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Get unique categories from quizzes
  const categories = Array.from(new Set(quizzes.map(quiz => quiz.category)));
  
  // Filter quizzes based on search and filters
  const filteredQuizzes = quizzes.filter(quiz => {
    // Search filter
    const matchesSearch = !searchQuery.trim() || 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Difficulty filter
    const matchesDifficulty = difficultyFilter === 'all' || 
      quiz.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || 
      quiz.category === categoryFilter;
    
    // Status filter
    const isCompleted = completedQuizIds.includes(quiz.id);
    const isInProgress = !isCompleted && quizProgress[quiz.id] > 0;
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'completed' && isCompleted) ||
      (statusFilter === 'in-progress' && isInProgress) ||
      (statusFilter === 'not-started' && !isCompleted && !isInProgress);
    
    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus;
  });
  
  return (
    <div className={`${styles.quizList} ${className || ''}`}>
      <div className={styles.header}>
        <Title level={4} className={styles.title}>Available Quizzes</Title>
        <div className={styles.searchBox}>
          <Search
            placeholder="Search quizzes"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={setSearchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
      
      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <Text className={styles.filterLabel}>
            <FilterOutlined /> Difficulty:
          </Text>
          <Select 
            value={difficultyFilter}
            onChange={setDifficultyFilter}
            className={styles.filterSelect}
          >
            <Option value="all">All</Option>
            <Option value="easy">Easy</Option>
            <Option value="medium">Medium</Option>
            <Option value="hard">Hard</Option>
          </Select>
        </div>
        
        {categories.length > 0 && (
          <div className={styles.filterItem}>
            <Text className={styles.filterLabel}>
              <FilterOutlined /> Category:
            </Text>
            <Select 
              value={categoryFilter}
              onChange={setCategoryFilter}
              className={styles.filterSelect}
            >
              <Option value="all">All</Option>
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </div>
        )}
        
        <div className={styles.filterItem}>
          <Text className={styles.filterLabel}>
            <FilterOutlined /> Status:
          </Text>
          <Select 
            value={statusFilter}
            onChange={setStatusFilter}
            className={styles.filterSelect}
          >
            <Option value="all">All</Option>
            <Option value="completed">Completed</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="not-started">Not Started</Option>
          </Select>
        </div>
      </div>
      
      <Divider className={styles.divider} />
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text className={styles.loadingText}>Loading quizzes...</Text>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <Empty 
          description={
            searchQuery || difficultyFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all'
              ? "No quizzes match your filters"
              : "No quizzes available at the moment"
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className={styles.empty}
        />
      ) : (
        <Row gutter={[24, 24]} className={styles.quizGrid}>
          {filteredQuizzes.map(quiz => (
            <Col xs={24} sm={12} lg={8} xl={6} key={quiz.id}>
              <QuizCard 
                quiz={quiz}
                isCompleted={completedQuizIds.includes(quiz.id)}
                completionPercentage={quizProgress[quiz.id] || 0}
                onStart={onStartQuiz}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default QuizList; 