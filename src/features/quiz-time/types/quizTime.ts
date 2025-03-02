/**
 * Quiz Time types
 */
import { 
  Quiz, 
  Question, 
  QuizResult, 
  Reward, 
  EventInfo,
  AnswerOption 
} from '../api/types';

// Re-export API types to be used throughout the feature
export type { 
  Quiz, 
  Question, 
  QuizResult, 
  Reward, 
  EventInfo,
  AnswerOption 
};

// Store state types
export type QuizTimeState = {
  // Quiz data
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  currentQuestions: Question[];
  currentQuestionIndex: number;
  
  // User data
  userUuid: string;
  results: QuizResult[];
  rewards: Reward[];
  
  // Event data
  eventInfo: EventInfo | null;
  
  // UI state
  isQuizzesLoading: boolean;
  isQuestionsLoading: boolean;
  isResultsLoading: boolean;
  isRewardsLoading: boolean;
  isEventInfoLoading: boolean;
  isSubmitting: boolean;
  
  // Error state
  error: string | null;
};

// Quiz state for ongoing quiz
export type OngoingQuizState = {
  quizId: string;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: number; // timestamp in ms
  endTime?: number; // timestamp in ms
};

export type UserAnswer = {
  questionId: string;
  answerId: string;
  timeSpent: number; // in seconds
  isCorrect?: boolean;
};

// Timer state
export type TimerState = {
  timeRemaining: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
};

// UI component props
export type QuizCardProps = {
  quiz: Quiz;
  onStart: (quizId: string) => void;
};

export type QuestionCardProps = {
  question: Question;
  selectedAnswerId?: string;
  timeRemaining: number;
  onSelectAnswer: (answerId: string) => void;
  isSubmitting?: boolean;
};

export type TimerProps = {
  duration: number;
  onComplete: () => void;
  isPaused?: boolean;
};

export type ResultSummaryProps = {
  result: QuizResult;
  onRestart?: () => void;
  onViewRewards?: () => void;
};

export type RewardProps = {
  reward: Reward;
  onRedeem?: (rewardId: string) => void;
};

// Function params and return types
export type CalculateScoreParams = {
  answers: UserAnswer[];
  questions: Question[];
  difficulty: string;
};

export type ScoreCalculationResult = {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
};

// Hook return types
export interface UseQuizParticipationReturn {
  currentQuiz: Quiz | null;
  currentQuestions: Question[];
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  isLoading: boolean;
  isQuestionsLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  userAnswers: UserAnswer[];
  selectedAnswerId: string | null;
  timeSpent: number;
  timeRemaining: number;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
  startQuiz: (quizId: string) => Promise<void>;
  answerQuestion: (answerId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => Promise<QuizResult>;
  resetQuiz: () => void;
}

export interface UseRewardsReturn {
  rewards: Reward[];
  isLoading: boolean;
  error: string | null;
  redeemReward: (rewardId: string) => Promise<void>;
  filterByType?: (type: string) => Reward[];
  filterByRedemptionStatus?: (isRedeemed: boolean) => Reward[];
  calculateTotalRewardValue?: () => number;
  calculateRedeemedRewardValue?: () => number;
  refreshRewards: () => Promise<void>;
} 