/**
 * Quiz Time API types
 */

export type Quiz = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number;
  timeLimit: number; // in seconds
  rewards: Reward[];
  category: string;
  isCompleted?: boolean;
  passingScore?: number;
  totalPoints?: number;
};

export type Question = {
  id: string;
  quizId: string;
  text: string;
  options: AnswerOption[];
  timeLimit: number; // in seconds
  points?: number;
  questionText?: string; // 기존 코드와의 호환성을 위해 추가
  imageUrl?: string;
  answers?: AnswerOption[]; // 기존 코드와의 호환성을 위해 추가
  explanation?: string;
};

export type AnswerOption = {
  id: string;
  text: string;
  isCorrect?: boolean; // Only included in responses, not requests
};

export type QuizSubmission = {
  userUuid: string;
  answers: AnswerSubmission[];
};

export type AnswerSubmission = {
  questionId: string;
  answerId: string;
  timeSpent: number; // in seconds
};

export type QuizResult = {
  resultId: string;
  quizId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  completedAt: string; // ISO date string
  rewards: Reward[];
  quiz: Quiz; // 참조하는 퀴즈 정보
  answers: Array<{
    questionId: string;
    answerId: string;
    timeSpent: number;
    isCorrect: boolean;
    pointsAwarded?: number;
    selectedAnswer: AnswerOption;
    question: Question;
  }>;
  timeTaken: number; // 총 소요 시간
  earnedRewardIds?: string[]; // 획득한 보상 ID 목록
};

export type Reward = {
  id: string;
  type: 'discount' | 'coupon' | 'points' | 'freebie' | 'gift' | 'experience';
  value: number;
  name: string;
  description: string;
  expiresAt: string; // ISO date string
  isRedeemed?: boolean;
  redemptionCode?: string;
  title?: string; // 기존 코드와의 호환성을 위해 추가
  expiryDate?: string; // 기존 코드와의 호환성을 위해 추가
  redeemedDate?: string;
  quizTitle?: string;
  quizResultId?: string;
};

export type EventInfo = {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  rules: string[];
  isActive: boolean;
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
};

export type QuizzesResponse = ApiResponse<{
  quizzes: Quiz[];
}>;

export type QuizDetailResponse = ApiResponse<{
  quiz: Quiz;
}>;

export type QuestionsResponse = ApiResponse<{
  questions: Question[];
}>;

export type SubmitQuizResponse = ApiResponse<{
  result: QuizResult;
}>;

export type ResultsResponse = ApiResponse<{
  results: QuizResult[];
}>;

export type ResultDetailResponse = ApiResponse<{
  result: QuizResult;
}>;

export type RewardsResponse = ApiResponse<{
  rewards: Reward[];
}>;

export type RedeemRewardResponse = ApiResponse<{
  success: boolean;
  redemptionCode: string;
}>;

export type EventInfoResponse = ApiResponse<{
  eventInfo: EventInfo;
}>; 