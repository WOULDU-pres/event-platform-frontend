import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, Card, Button, Progress, Radio, Space, 
  Spin, Result, Modal, Alert, Row, Col 
} from 'antd';
import { 
  ClockCircleOutlined, LeftOutlined, RightOutlined, 
  CheckOutlined, ExclamationCircleOutlined, TrophyOutlined
} from '@ant-design/icons';
import { useQuizParticipation } from '../../hooks';
import styles from './QuizPlayPage.module.css';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

/**
 * QuizPlayPage component
 * Page for actively participating in a quiz
 */
const QuizPlayPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const {
    currentQuiz,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isLoading,
    isQuestionsLoading,
    isSubmitting,
    error,
    userAnswers,
    selectedAnswerId,
    timeSpent,
    timeRemaining,
    isLastQuestion,
    isFirstQuestion,
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz
  } = useQuizParticipation(quizId);
  
  // Initialize quiz on component mount
  useEffect(() => {
    if (quizId) {
      startQuiz(quizId);
    }
    
    return () => {
      resetQuiz();
    };
  }, [quizId, startQuiz, resetQuiz]);
  
  // Calculate progress percentage
  const progressPercentage = totalQuestions > 0
    ? Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)
    : 0;
  
  // Handle answer selection
  const handleAnswerSelect = (answerId: string) => {
    if (currentQuestion) {
      answerQuestion(answerId);
    }
  };
  
  // Handle quiz submission
  const handleSubmitQuiz = () => {
    confirm({
      title: 'Are you sure you want to submit your quiz?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Paragraph>
            You've answered {userAnswers.length} out of {totalQuestions} questions.
          </Paragraph>
          {totalQuestions > userAnswers.length && (
            <Alert 
              message={`You have ${totalQuestions - userAnswers.length} unanswered questions.`}
              type="warning" 
              showIcon
            />
          )}
        </div>
      ),
      onOk() {
        submitQuiz().then((result) => {
          navigate(`/quiz-time/results/${result.resultId}`);
        });
      }
    });
  };
  
  // Handle time up
  const handleTimeUp = () => {
    Modal.warning({
      title: 'Time is up!',
      content: 'Your time for this quiz has ended. Your answers will be submitted automatically.',
      onOk() {
        submitQuiz().then((result) => {
          navigate(`/quiz-time/results/${result.resultId}`);
        });
      }
    });
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
        <Text>Loading quiz...</Text>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load quiz"
        subTitle={error}
        extra={[
          <Button type="primary" key="back" onClick={() => navigate('/quiz-time')}>
            Back to Quiz Time
          </Button>
        ]}
      />
    );
  }
  
  // Render quiz not found
  if (!currentQuiz) {
    return (
      <Result
        status="404"
        title="Quiz not found"
        subTitle="The quiz you're looking for doesn't exist."
        extra={[
          <Button type="primary" key="back" onClick={() => navigate('/quiz-time')}>
            Back to Quiz Time
          </Button>
        ]}
      />
    );
  }

  // Find the answer for the current question
  const currentAnswer = currentQuestion ? 
    userAnswers.find(answer => answer.questionId === currentQuestion.id)?.answerId : 
    undefined;
  
  return (
    <div className={styles.quizPlayPage}>
      <div className={styles.header}>
        <Title level={3}>{currentQuiz.title}</Title>
        <Paragraph>{currentQuiz.description}</Paragraph>
      </div>
      
      <div className={styles.progressContainer}>
        <Progress 
          percent={progressPercentage} 
          status="active"
          format={() => `${currentQuestionIndex + 1}/${totalQuestions}`}
        />
        
        <div className={styles.timerContainer}>
          <ClockCircleOutlined />
          <Text>
            {timeRemaining > 0 
              ? `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`
              : '0:00'
            }
          </Text>
        </div>
      </div>
      
      {isQuestionsLoading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text>Loading questions...</Text>
        </div>
      ) : currentQuestion ? (
        <Card className={styles.questionCard}>
          <div className={styles.questionHeader}>
            <Text strong>Question {currentQuestionIndex + 1}:</Text>
            {currentQuestion.points && (
              <Text className={styles.pointsLabel}>{currentQuestion.points} points</Text>
            )}
          </div>
          
          <Paragraph className={styles.questionText}>
            {currentQuestion.questionText || currentQuestion.text}
          </Paragraph>
          
          {currentQuestion.imageUrl && (
            <div className={styles.questionImageContainer}>
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question" 
                className={styles.questionImage}
              />
            </div>
          )}
          
          <div className={styles.answersContainer}>
            <Radio.Group 
              value={currentAnswer || selectedAnswerId} 
              onChange={(e) => handleAnswerSelect(e.target.value)}
              className={styles.answerGroup}
            >
              <Space direction="vertical" className={styles.answerSpace}>
                {(currentQuestion.options || currentQuestion.answers || []).map((answer) => (
                  <Radio 
                    key={answer.id} 
                    value={answer.id}
                    className={styles.answerOption}
                  >
                    {answer.text}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </Card>
      ) : (
        <Result
          status="warning"
          title="No questions available"
          subTitle="This quiz doesn't have any questions."
          extra={[
            <Button type="primary" key="back" onClick={() => navigate('/quiz-time')}>
              Back to Quiz Time
            </Button>
          ]}
        />
      )}
      
      <div className={styles.navigationButtons}>
        <Button 
          type="default" 
          icon={<LeftOutlined />}
          onClick={previousQuestion}
          disabled={isFirstQuestion || isSubmitting}
        >
          Previous
        </Button>
        
        <div>
          {isLastQuestion ? (
            <Button 
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleSubmitQuiz}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              type="primary"
              icon={<RightOutlined />}
              onClick={nextQuestion}
              disabled={isSubmitting}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      
      <div className={styles.quizStatus}>
        <Card className={styles.statusCard}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div className={styles.statusItem}>
                <Text type="secondary">Time Spent</Text>
                <Text strong>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.statusItem}>
                <Text type="secondary">Questions Answered</Text>
                <Text strong>{userAnswers.length}/{totalQuestions}</Text>
              </div>
            </Col>
          </Row>
        </Card>
        
        <Button 
          type="default"
          icon={<TrophyOutlined />}
          onClick={handleSubmitQuiz}
          loading={isSubmitting}
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          Finish & See Results
        </Button>
      </div>
    </div>
  );
};

export default QuizPlayPage; 