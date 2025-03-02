import React, { useState, useEffect, useRef } from 'react';
import { Progress } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import styles from './QuizTimer.module.css';

export interface QuizTimerProps {
  duration: number; // in seconds
  timeRemaining: number; // in seconds
  onComplete: () => void;
  isPaused?: boolean;
  showProgress?: boolean;
  size?: 'small' | 'default' | 'large';
}

/**
 * QuizTimer component
 * Displays a countdown timer for quiz questions
 */
const QuizTimer: React.FC<QuizTimerProps> = ({
  duration,
  timeRemaining,
  onComplete,
  isPaused = false,
  showProgress = true,
  size = 'default'
}) => {
  const [internalTimeRemaining, setInternalTimeRemaining] = useState<number>(timeRemaining);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Calculate progress percentage
  const progressPercentage = Math.round((internalTimeRemaining / duration) * 100);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Determine progress status and color based on time remaining
  const getProgressStatus = (): 'success' | 'normal' | 'exception' => {
    if (progressPercentage > 60) return 'success';
    if (progressPercentage > 20) return 'normal';
    return 'exception';
  };
  
  // Update time remaining
  useEffect(() => {
    setInternalTimeRemaining(timeRemaining);
  }, [timeRemaining]);
  
  // Start timer
  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Don't start timer if paused or time is already up
    if (isPaused || internalTimeRemaining <= 0) {
      return;
    }
    
    // Set up timer interval
    timerRef.current = setInterval(() => {
      setInternalTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // Check if timer is complete
        if (newTime <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          onComplete();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, internalTimeRemaining, onComplete]);
  
  // Set up size-based classes
  const containerClass = `${styles.timerContainer} ${
    size === 'small' ? styles.small : size === 'large' ? styles.large : ''
  }`;
  
  return (
    <div className={containerClass}>
      {showProgress ? (
        <Progress
          type="circle"
          percent={progressPercentage}
          status={getProgressStatus()}
          format={() => (
            <div className={styles.timerText}>
              <ClockCircleOutlined className={styles.clockIcon} />
              <span>{formatTime(internalTimeRemaining)}</span>
            </div>
          )}
          width={size === 'small' ? 60 : size === 'large' ? 120 : 80}
          className={styles.timerProgress}
        />
      ) : (
        <div className={styles.simpleTimer}>
          <ClockCircleOutlined className={styles.clockIcon} />
          <span className={styles.timeText}>{formatTime(internalTimeRemaining)}</span>
        </div>
      )}
    </div>
  );
};

export default QuizTimer; 