import axios from 'axios';
import {
  QuizzesResponse,
  QuizDetailResponse,
  QuestionsResponse,
  SubmitQuizResponse,
  ResultsResponse,
  ResultDetailResponse,
  RewardsResponse,
  RedeemRewardResponse,
  EventInfoResponse,
  QuizSubmission
} from './types';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/quiz-time`;

// Quiz API

/**
 * Fetches all available quizzes
 */
export const getQuizzes = async (): Promise<QuizzesResponse> => {
  try {
    const response = await axios.get<QuizzesResponse>(`${BASE_URL}/quizzes`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { quizzes: [] },
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch quizzes'
      }
    };
  }
};

/**
 * Fetches detailed information about a specific quiz
 */
export const getQuizDetail = async (quizId: string): Promise<QuizDetailResponse> => {
  try {
    const response = await axios.get<QuizDetailResponse>(`${BASE_URL}/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { quiz: {} as any },
      error: {
        code: 'FETCH_ERROR',
        message: `Failed to fetch quiz with ID: ${quizId}`
      }
    };
  }
};

/**
 * Fetches questions for a specific quiz
 */
export const getQuestions = async (quizId: string): Promise<QuestionsResponse> => {
  try {
    const response = await axios.get<QuestionsResponse>(`${BASE_URL}/quizzes/${quizId}/questions`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { questions: [] },
      error: {
        code: 'FETCH_ERROR',
        message: `Failed to fetch questions for quiz ID: ${quizId}`
      }
    };
  }
};

/**
 * Submits quiz answers
 */
export const submitQuiz = async (quizId: string, submission: QuizSubmission): Promise<SubmitQuizResponse> => {
  try {
    const response = await axios.post<SubmitQuizResponse>(
      `${BASE_URL}/quizzes/${quizId}/submit`,
      submission
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { result: {} as any },
      error: {
        code: 'SUBMISSION_ERROR',
        message: 'Failed to submit quiz answers'
      }
    };
  }
};

// Results API

/**
 * Fetches user's quiz history
 */
export const getResults = async (userUuid: string): Promise<ResultsResponse> => {
  try {
    const response = await axios.get<ResultsResponse>(`${BASE_URL}/results?userUuid=${userUuid}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { results: [] },
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch quiz results'
      }
    };
  }
};

/**
 * Fetches specific quiz result details
 */
export const getResultDetail = async (resultId: string): Promise<ResultDetailResponse> => {
  try {
    const response = await axios.get<ResultDetailResponse>(`${BASE_URL}/results/${resultId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { result: {} as any },
      error: {
        code: 'FETCH_ERROR',
        message: `Failed to fetch result with ID: ${resultId}`
      }
    };
  }
};

// Rewards API

/**
 * Fetches user's earned rewards
 */
export const getRewards = async (userUuid: string): Promise<RewardsResponse> => {
  try {
    const response = await axios.get<RewardsResponse>(`${BASE_URL}/rewards?userUuid=${userUuid}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { rewards: [] },
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch rewards'
      }
    };
  }
};

/**
 * Redeems a specific reward
 */
export const redeemReward = async (rewardId: string, userUuid: string): Promise<RedeemRewardResponse> => {
  try {
    const response = await axios.post<RedeemRewardResponse>(
      `${BASE_URL}/rewards/${rewardId}/redeem`,
      { userUuid }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { success: false, redemptionCode: '' },
      error: {
        code: 'REDEMPTION_ERROR',
        message: 'Failed to redeem reward'
      }
    };
  }
};

// Event Information API

/**
 * Fetches current event information, period, rules
 */
export const getEventInfo = async (): Promise<EventInfoResponse> => {
  try {
    const response = await axios.get<EventInfoResponse>(`${BASE_URL}/event-info`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      data: { eventInfo: {} as any },
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch event information'
      }
    };
  }
}; 