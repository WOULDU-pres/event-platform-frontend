import React from 'react';
import { Card, Typography, Space, Button, Divider } from 'antd';
import { Question, AnswerOption as AnswerOptionType } from '../../types';
import AnswerOption from '../AnswerOption';
import QuizTimer from '../QuizTimer';
import styles from './QuestionCard.module.css';

const { Title, Text } = Typography;

export interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswerId?: string;
  timeRemaining: number;
  timeLimitInSeconds: number;
  showFeedback?: boolean;
  isSubmitting?: boolean;
  isTimerPaused?: boolean;
  onSelectAnswer: (answerId: string) => void;
  onSubmit: () => void;
  onTimeUp: () => void;
  className?: string;
}

/**
 * QuestionCard component
 * Displays a quiz question with answer options and timer
 */
const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswerId,
  timeRemaining,
  timeLimitInSeconds,
  showFeedback = false,
  isSubmitting = false,
  isTimerPaused = false,
  onSelectAnswer,
  onSubmit,
  onTimeUp,
  className,
}) => {
  // Check if an answer is selected
  const hasSelectedAnswer = !!selectedAnswerId;
  
  return (
    <div className={`${styles.questionCard} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.questionInfo}>
          <Text className={styles.questionNumber}>
            Question {questionNumber} of {totalQuestions}
          </Text>
          <div className={styles.progressIndicator}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        <div className={styles.timerContainer}>
          <QuizTimer 
            duration={timeLimitInSeconds}
            timeRemaining={timeRemaining}
            onComplete={onTimeUp}
            isPaused={isTimerPaused}
            size="default"
          />
        </div>
      </div>
      
      <Card className={styles.questionContent}>
        <Title level={4} className={styles.questionText}>
          {question.text}
        </Title>
        
        <Divider className={styles.divider} />
        
        <div className={styles.optionsContainer}>
          {question.options.map((option: AnswerOptionType) => (
            <AnswerOption
              key={option.id}
              option={option}
              isSelected={selectedAnswerId === option.id}
              isDisabled={isSubmitting || showFeedback}
              showCorrectAnswer={showFeedback}
              onSelect={onSelectAnswer}
            />
          ))}
        </div>
        
        <div className={styles.actionArea}>
          <Button
            type="primary"
            size="large"
            disabled={!hasSelectedAnswer || isSubmitting}
            loading={isSubmitting}
            onClick={onSubmit}
            className={styles.submitButton}
          >
            {showFeedback ? 'Next Question' : 'Submit Answer'}
          </Button>
        </div>
      </Card>
      
      <div className={styles.footer}>
        <Space>
          <Text type="secondary">
            {showFeedback 
              ? '✓ Answer submitted. Click Next to continue.' 
              : 'Select an answer and click Submit.'}
          </Text>
        </Space>
      </div>
    </div>
  );
};

export default QuestionCard; 