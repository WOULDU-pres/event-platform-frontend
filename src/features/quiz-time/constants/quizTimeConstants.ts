/**
 * Quiz Time constants
 */

// Quiz difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const;

// Quiz categories
export const QUIZ_CATEGORIES = {
  PRODUCT: 'product',
  GENERAL_KNOWLEDGE: 'general_knowledge',
  SEASONAL: 'seasonal',
  PROMOTIONAL: 'promotional'
} as const;

// Reward types
export const REWARD_TYPES = {
  DISCOUNT: 'discount',
  COUPON: 'coupon',
  POINTS: 'points'
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_UUID: 'quiz-time-user-uuid',
  QUIZ_PROGRESS: 'quiz-time-progress',
  LAST_QUIZ: 'quiz-time-last-quiz'
} as const;

// Time limits (in seconds)
export const TIME_LIMITS = {
  DEFAULT_QUESTION: 20,
  EASY_QUESTION: 30,
  MEDIUM_QUESTION: 20,
  HARD_QUESTION: 15,
  QUIZ_RESULT_DISPLAY: 10
} as const;

// Scoring constants
export const SCORING = {
  CORRECT_ANSWER_BASE: 10,
  TIME_BONUS_MULTIPLIER: 0.5, // Multiplier for remaining time bonus
  DIFFICULTY_MULTIPLIER: {
    [DIFFICULTY_LEVELS.EASY]: 1,
    [DIFFICULTY_LEVELS.MEDIUM]: 1.5,
    [DIFFICULTY_LEVELS.HARD]: 2.5
  }
} as const;

// Event status
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  ENDED: 'ended'
} as const;

// API error codes
export const ERROR_CODES = {
  FETCH_ERROR: 'FETCH_ERROR',
  SUBMISSION_ERROR: 'SUBMISSION_ERROR',
  REDEMPTION_ERROR: 'REDEMPTION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
} as const;

// Pagination limits
export const PAGINATION = {
  QUIZZES_PER_PAGE: 6,
  RESULTS_PER_PAGE: 10,
  REWARDS_PER_PAGE: 8
} as const; 