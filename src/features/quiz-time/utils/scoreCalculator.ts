/**
 * Score Calculator utility
 * Calculates quiz scores based on answers, time taken, and difficulty
 */
import { CalculateScoreParams, ScoreCalculationResult, Question, UserAnswer } from '../types';
import { SCORING, DIFFICULTY_LEVELS } from '../constants';

/**
 * Calculates the score for a completed quiz
 * @param {CalculateScoreParams} params - Parameters for score calculation
 * @returns {ScoreCalculationResult} Calculated score and related statistics
 */
export const calculateScore = ({
  answers,
  questions,
  difficulty
}: CalculateScoreParams): ScoreCalculationResult => {
  let totalScore = 0;
  let correctAnswers = 0;
  let totalTimeSpent = 0;
  
  // Get the correct difficulty multiplier or default to EASY
  const difficultyMultiplier = 
    SCORING.DIFFICULTY_MULTIPLIER[difficulty as keyof typeof SCORING.DIFFICULTY_MULTIPLIER] || 
    SCORING.DIFFICULTY_MULTIPLIER[DIFFICULTY_LEVELS.EASY];
  
  // Process each answer
  answers.forEach((answer) => {
    // Find the corresponding question
    const question = questions.find((q) => q.id === answer.questionId);
    
    if (!question) return;
    
    // Find if the selected answer is correct
    const selectedOption = question.options.find((opt) => opt.id === answer.answerId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    // Add time spent to total
    totalTimeSpent += answer.timeSpent;
    
    if (isCorrect) {
      correctAnswers++;
      
      // Calculate base score for correct answer
      let answerScore = Number(SCORING.CORRECT_ANSWER_BASE);
      
      // Calculate time bonus if applicable
      const timeLimit = question.timeLimit;
      const timeRemaining = Math.max(0, timeLimit - answer.timeSpent);
      const timeBonus = Math.floor(timeRemaining * SCORING.TIME_BONUS_MULTIPLIER);
      
      // Add time bonus to answer score
      answerScore += timeBonus;
      
      // Apply difficulty multiplier
      answerScore = Math.floor(answerScore * difficultyMultiplier);
      
      // Add to total score
      totalScore += answerScore;
    }
  });
  
  return {
    score: totalScore,
    correctAnswers,
    totalQuestions: questions.length,
    timeSpent: totalTimeSpent
  };
};

/**
 * Estimates the maximum possible score for a quiz
 * @param {Question[]} questions - The quiz questions
 * @param {string} difficulty - The quiz difficulty
 * @returns {number} The maximum possible score
 */
export const calculateMaxPossibleScore = (
  questions: Question[],
  difficulty: string
): number => {
  const difficultyMultiplier = 
    SCORING.DIFFICULTY_MULTIPLIER[difficulty as keyof typeof SCORING.DIFFICULTY_MULTIPLIER] || 
    SCORING.DIFFICULTY_MULTIPLIER[DIFFICULTY_LEVELS.EASY];
  
  let maxScore = 0;
  
  // For each question, calculate the maximum possible score
  // assuming all answers are correct and answered instantly
  questions.forEach((question) => {
    // Base score + maximum time bonus
    const questionMaxScore = Number(SCORING.CORRECT_ANSWER_BASE) + 
      (question.timeLimit * SCORING.TIME_BONUS_MULTIPLIER);
    
    // Apply difficulty multiplier
    maxScore += Math.floor(questionMaxScore * difficultyMultiplier);
  });
  
  return maxScore;
};

/**
 * Calculates the percentage score
 * @param {number} score - The actual score
 * @param {number} maxPossibleScore - The maximum possible score
 * @returns {number} The percentage score (0-100)
 */
export const calculatePercentageScore = (
  score: number,
  maxPossibleScore: number
): number => {
  if (maxPossibleScore <= 0) return 0;
  return Math.min(100, Math.round((score / maxPossibleScore) * 100));
};

/**
 * Enriches the answers with correctness information
 * @param {UserAnswer[]} answers - The user's answers
 * @param {Question[]} questions - The quiz questions
 * @returns {UserAnswer[]} Answers with correctness information
 */
export const enrichAnswersWithCorrectness = (
  answers: UserAnswer[],
  questions: Question[]
): UserAnswer[] => {
  return answers.map((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    
    if (!question) return answer;
    
    const selectedOption = question.options.find((opt) => opt.id === answer.answerId);
    const isCorrect = selectedOption?.isCorrect || false;
    
    return {
      ...answer,
      isCorrect
    };
  });
}; 