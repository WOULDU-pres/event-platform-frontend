import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuizTimeStore } from '../stores';
import { UseQuizParticipationReturn, QuizResult } from '../types';
import { calculateTimeSpent } from '../utils';

/**
 * Hook for managing quiz participation
 * Handles question navigation, answering, timing, and submission
 */
export const useQuizParticipation = (quizId?: string): UseQuizParticipationReturn => {
  const store = useQuizTimeStore();
  
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  
  const questionStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentQuestion = store.currentQuestions[store.currentQuestionIndex] || null;
  const totalQuestions = store.currentQuestions.length;
  const isLastQuestion = store.currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = store.currentQuestionIndex === 0;
  
  // Navigate to next question
  const nextQuestion = useCallback(() => {
    if (isLastQuestion) return;
    
    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Move to next question in store
    store.nextQuestion();
    
    // Reset timer
    questionStartTimeRef.current = Date.now();
  }, [isLastQuestion, store]);
  
  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    if (isFirstQuestion) return;
    
    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Move to previous question in store
    store.previousQuestion();
    
    // Reset timer
    questionStartTimeRef.current = Date.now();
  }, [isFirstQuestion, store]);
  
  // Submit the quiz
  const submitQuiz = useCallback(async (): Promise<QuizResult> => {
    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // This function should be updated to return actual QuizResult data
    // For now, as a workaround, returning a dummy result with an ID
    await store.submitQuizAnswers();
    
    // This is just a placeholder to avoid type errors
    // In a real implementation, we'd get this from the API response
    return {
      id: 'temp-result-id',
      resultId: 'temp-result-id'
    } as any;
  }, [store]);
  
  // Initialize the quiz
  const startQuiz = useCallback(async (id: string) => {
    if (!id) return;
    
    await store.startQuiz(id);
    setUserAnswers([]);
    setSelectedAnswerId(null);
    setTimeSpent(0);
    
    // Reset timer
    questionStartTimeRef.current = Date.now();
  }, [store]);
  
  // Start quiz with the provided quizId (if available)
  useEffect(() => {
    if (quizId) {
      startQuiz(quizId);
    }
  }, [quizId, startQuiz]);
  
  // Handle answering a question
  const answerQuestion = useCallback((answerId: string) => {
    if (!currentQuestion) return;
    
    // Record time spent
    const timeSpentOnQuestion = calculateTimeSpent(
      questionStartTimeRef.current,
      Date.now()
    );
    
    // Update answer in store
    store.answerQuestion(answerId, timeSpentOnQuestion);
    
    // Update local state
    setSelectedAnswerId(answerId);
    
    // Update userAnswers array
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      const existingIndex = newAnswers.findIndex(
        a => a.questionId === currentQuestion.id
      );
      
      const userAnswer = {
        questionId: currentQuestion.id,
        answerId,
        timeSpent: timeSpentOnQuestion
      };
      
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = userAnswer;
      } else {
        newAnswers.push(userAnswer);
      }
      
      return newAnswers;
    });
  }, [currentQuestion, store]);
  
  // Reset quiz
  const resetQuiz = useCallback(() => {
    // Clear timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    store.resetQuiz();
    setUserAnswers([]);
    setSelectedAnswerId(null);
    setTimeSpent(0);
    setTimeRemaining(0);
  }, [store]);
  
  // Update timer for current question
  useEffect(() => {
    if (!currentQuestion) return;
    
    // Clear existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Set initial time remaining
    setTimeRemaining(currentQuestion.timeLimit);
    
    // Start timer
    questionStartTimeRef.current = Date.now();
    
    const timerFunc = () => {
      const elapsed = calculateTimeSpent(questionStartTimeRef.current, Date.now());
      const remaining = Math.max(0, currentQuestion.timeLimit - elapsed);
      
      setTimeSpent(elapsed);
      setTimeRemaining(remaining);
      
      // Auto-submit when time runs out
      if (remaining <= 0 && timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        
        // If no answer selected, automatically move to next question
        // or submit if it's the last question
        if (isLastQuestion) {
          store.submitQuizAnswers();
        } else {
          nextQuestion();
        }
      }
    };
    
    timerIntervalRef.current = setInterval(timerFunc, 1000);
    
    // Set selected answer if user has already answered this question
    const existingAnswer = userAnswers.find(
      answer => answer.questionId === currentQuestion.id
    );
    
    if (existingAnswer) {
      setSelectedAnswerId(existingAnswer.answerId);
    } else {
      setSelectedAnswerId(null);
    }
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currentQuestion, isLastQuestion, store, nextQuestion, userAnswers]);
  
  return {
    currentQuiz: store.currentQuiz,
    currentQuestions: store.currentQuestions,
    currentQuestion,
    currentQuestionIndex: store.currentQuestionIndex,
    totalQuestions,
    isLoading: store.isQuizzesLoading,
    isQuestionsLoading: store.isQuestionsLoading,
    isSubmitting: store.isSubmitting,
    error: store.error,
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
  };
}; 