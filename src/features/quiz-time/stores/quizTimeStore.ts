import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  getQuizzes,
  getQuizDetail,
  getQuestions,
  submitQuiz,
  getResults,
  getRewards,
  getEventInfo,
  redeemReward
} from '../api';
import { QuizTimeState, OngoingQuizState, UserAnswer } from '../types';
import { generateUserUuid } from '../utils/uuidGenerator';
import { STORAGE_KEYS } from '../constants';

// Helper to get the stored user UUID or create a new one
const getOrCreateUserUuid = (): string => {
  const userUuid = localStorage.getItem(STORAGE_KEYS.USER_UUID);
  
  if (!userUuid) {
    const newUuid = generateUserUuid();
    localStorage.setItem(STORAGE_KEYS.USER_UUID, newUuid);
    return newUuid;
  }
  
  return userUuid;
};

// Helper to get any stored quiz progress
const getStoredQuizProgress = (): OngoingQuizState | null => {
  const storedProgress = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
  
  if (storedProgress) {
    try {
      return JSON.parse(storedProgress);
    } catch (error) {
      console.error('Failed to parse stored quiz progress:', error);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
    }
  }
  
  return null;
};

// Initial state
const initialState: QuizTimeState = {
  // Quiz data
  quizzes: [],
  currentQuiz: null,
  currentQuestions: [],
  currentQuestionIndex: 0,
  
  // User data
  userUuid: getOrCreateUserUuid(),
  results: [],
  rewards: [],
  
  // Event data
  eventInfo: null,
  
  // UI state
  isQuizzesLoading: false,
  isQuestionsLoading: false,
  isResultsLoading: false,
  isRewardsLoading: false,
  isEventInfoLoading: false,
  isSubmitting: false,
  
  // Error state
  error: null,
};

// 스토어 액션 타입 정의
type QuizTimeActions = {
  // Fetch Actions
  fetchQuizzes: () => Promise<void>;
  fetchQuizDetail: (quizId: string) => Promise<void>;
  fetchQuestions: (quizId: string) => Promise<void>;
  fetchResults: () => Promise<void>;
  fetchRewards: () => Promise<void>;
  fetchEventInfo: () => Promise<void>;
  
  // Quiz Participation Actions
  startQuiz: (quizId: string) => Promise<void>;
  answerQuestion: (answerId: string, timeSpent: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuizAnswers: () => Promise<void>;
  resetQuiz: () => void;
  
  // Reward Actions
  redeemReward: (rewardId: string) => Promise<void>;
  
  // Utils
  setError: (error: string | null) => void;
};

// 스토어 타입 (상태 + 액션)
type QuizTimeStore = QuizTimeState & QuizTimeActions;

// Zustand 스토어 생성 함수
export const useQuizTimeStore = create<QuizTimeStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Fetch Actions
      fetchQuizzes: async () => {
        set({ isQuizzesLoading: true, error: null });
        try {
          const response = await getQuizzes();
          
          if (response.success) {
            set({ quizzes: response.data.quizzes, isQuizzesLoading: false });
          } else {
            set({ 
              error: response.error?.message || 'Failed to fetch quizzes', 
              isQuizzesLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'An unexpected error occurred while fetching quizzes', 
            isQuizzesLoading: false 
          });
        }
      },
      
      fetchQuizDetail: async (quizId: string) => {
        set({ isQuizzesLoading: true, error: null });
        try {
          const response = await getQuizDetail(quizId);
          
          if (response.success) {
            set({ currentQuiz: response.data.quiz, isQuizzesLoading: false });
          } else {
            set({ 
              error: response.error?.message || `Failed to fetch quiz details for ID: ${quizId}`, 
              isQuizzesLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'An unexpected error occurred while fetching quiz details', 
            isQuizzesLoading: false 
          });
        }
      },
      
      fetchQuestions: async (quizId: string) => {
        set({ isQuestionsLoading: true, error: null });
        try {
          const response = await getQuestions(quizId);
          
          if (response.success) {
            set({ 
              currentQuestions: response.data.questions, 
              isQuestionsLoading: false 
            });
          } else {
            set({ 
              error: response.error?.message || `Failed to fetch questions for quiz ID: ${quizId}`, 
              isQuestionsLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'An unexpected error occurred while fetching questions', 
            isQuestionsLoading: false 
          });
        }
      },
      
      fetchResults: async () => {
        const { userUuid } = get();
        set({ isResultsLoading: true, error: null });
        
        try {
          const response = await getResults(userUuid);
          
          if (response.success) {
            set({ results: response.data.results, isResultsLoading: false });
          } else {
            set({ 
              error: response.error?.message || 'Failed to fetch quiz results', 
              isResultsLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'An unexpected error occurred while fetching results', 
            isResultsLoading: false 
          });
        }
      },
      
      fetchRewards: async () => {
        const { userUuid } = get();
        set({ isRewardsLoading: true, error: null });
        
        try {
          const response = await getRewards(userUuid);
          
          if (response.success) {
            set({ rewards: response.data.rewards, isRewardsLoading: false });
          } else {
            set({ 
              error: response.error?.message || 'Failed to fetch rewards', 
              isRewardsLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'An unexpected error occurred while fetching rewards', 
            isRewardsLoading: false 
          });
        }
      },
      
      fetchEventInfo: async () => {
        set({ isEventInfoLoading: true, error: null });
        
        try {
          const response = await getEventInfo();
          
          if (response.success) {
            set({ eventInfo: response.data.eventInfo, isEventInfoLoading: false });
          } else {
            set({ 
              error: response.error?.message || 'Failed to fetch event information', 
              isEventInfoLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'An unexpected error occurred while fetching event information', 
            isEventInfoLoading: false 
          });
        }
      },
      
      // Quiz Participation Actions
      startQuiz: async (quizId: string) => {
        // Reset any existing quiz state
        set({ 
          currentQuestionIndex: 0,
          error: null 
        });
        
        // Save progress to localStorage
        const quizProgress: OngoingQuizState = {
          quizId,
          currentQuestionIndex: 0,
          answers: [],
          startTime: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(quizProgress));
        
        // Fetch quiz details and questions
        await get().fetchQuizDetail(quizId);
        await get().fetchQuestions(quizId);
      },
      
      answerQuestion: (answerId: string, timeSpent: number) => {
        const { currentQuestions, currentQuestionIndex } = get();
        const currentQuestion = currentQuestions[currentQuestionIndex];
        
        if (!currentQuestion) return;
        
        // Track the answer
        const userAnswer: UserAnswer = {
          questionId: currentQuestion.id,
          answerId,
          timeSpent
        };
        
        // Get stored progress
        const storedProgress = getStoredQuizProgress();
        
        if (storedProgress && storedProgress.quizId === get().currentQuiz?.id) {
          // Update stored answers
          const updatedAnswers = [...storedProgress.answers];
          const existingAnswerIndex = updatedAnswers.findIndex(
            a => a.questionId === currentQuestion.id
          );
          
          if (existingAnswerIndex >= 0) {
            updatedAnswers[existingAnswerIndex] = userAnswer;
          } else {
            updatedAnswers.push(userAnswer);
          }
          
          // Update localStorage
          const updatedProgress: OngoingQuizState = {
            ...storedProgress,
            answers: updatedAnswers
          };
          
          localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(updatedProgress));
        }
      },
      
      nextQuestion: () => {
        const { currentQuestionIndex, currentQuestions } = get();
        
        if (currentQuestionIndex < currentQuestions.length - 1) {
          const newIndex = currentQuestionIndex + 1;
          set({ currentQuestionIndex: newIndex });
          
          // Update stored progress
          const storedProgress = getStoredQuizProgress();
          
          if (storedProgress && storedProgress.quizId === get().currentQuiz?.id) {
            const updatedProgress: OngoingQuizState = {
              ...storedProgress,
              currentQuestionIndex: newIndex
            };
            
            localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(updatedProgress));
          }
        }
      },
      
      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        
        if (currentQuestionIndex > 0) {
          const newIndex = currentQuestionIndex - 1;
          set({ currentQuestionIndex: newIndex });
          
          // Update stored progress
          const storedProgress = getStoredQuizProgress();
          
          if (storedProgress && storedProgress.quizId === get().currentQuiz?.id) {
            const updatedProgress: OngoingQuizState = {
              ...storedProgress,
              currentQuestionIndex: newIndex
            };
            
            localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(updatedProgress));
          }
        }
      },
      
      submitQuizAnswers: async () => {
        const { currentQuiz, userUuid } = get();
        set({ isSubmitting: true, error: null });
        
        const storedProgress = getStoredQuizProgress();
        
        if (!currentQuiz || !storedProgress || storedProgress.quizId !== currentQuiz.id) {
          set({ 
            error: 'No quiz in progress to submit', 
            isSubmitting: false 
          });
          return;
        }
        
        // Mark quiz as completed
        const updatedProgress: OngoingQuizState = {
          ...storedProgress,
          endTime: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(updatedProgress));
        
        try {
          const response = await submitQuiz(currentQuiz.id, {
            userUuid,
            answers: storedProgress.answers
          });
          
          if (response.success) {
            // Clear quiz progress from localStorage
            localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
            
            // Save last quiz result
            localStorage.setItem(
              STORAGE_KEYS.LAST_QUIZ,
              JSON.stringify(response.data.result)
            );
            
            // Refresh results and rewards
            await get().fetchResults();
            await get().fetchRewards();
            
            set({ isSubmitting: false });
          } else {
            set({ 
              error: response.error?.message || 'Failed to submit quiz answers', 
              isSubmitting: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'An unexpected error occurred while submitting quiz', 
            isSubmitting: false 
          });
        }
      },
      
      resetQuiz: () => {
        set({
          currentQuiz: null,
          currentQuestions: [],
          currentQuestionIndex: 0,
          error: null
        });
        
        localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
      },
      
      // Reward Actions
      redeemReward: async (rewardId: string) => {
        const { userUuid } = get();
        set({ isRewardsLoading: true, error: null });
        
        try {
          const response = await redeemReward(rewardId, userUuid);
          
          if (response.success) {
            // Refresh rewards
            await get().fetchRewards();
            set({ isRewardsLoading: false });
          } else {
            set({ 
              error: response.error?.message || 'Failed to redeem reward', 
              isRewardsLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'An unexpected error occurred while redeeming reward', 
            isRewardsLoading: false 
          });
        }
      },
      
      // Utils
      setError: (error: string | null) => {
        set({ error });
      }
    })
  )
); 