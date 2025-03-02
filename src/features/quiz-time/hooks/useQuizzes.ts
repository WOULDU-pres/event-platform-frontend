import { useEffect, useState, useCallback } from 'react';
import { useQuizTimeStore } from '../stores';
import { Quiz } from '../types';

type UseQuizzesReturn = {
  quizzes: Quiz[];
  filteredQuizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
  filterByCategory: (category: string | null) => void;
  filterByDifficulty: (difficulty: string | null) => void;
  searchQuizzes: (query: string) => void;
  refreshQuizzes: () => Promise<void>;
  selectedCategory: string | null;
  selectedDifficulty: string | null;
  searchQuery: string;
};

/**
 * Hook for fetching and managing quizzes
 * Provides filtering by category, difficulty, and search functionality
 */
export const useQuizzes = (): UseQuizzesReturn => {
  const { quizzes, isQuizzesLoading, error, fetchQuizzes } = useQuizTimeStore();
  
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(quizzes);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Initial fetch of quizzes
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);
  
  // Filter quizzes whenever filters or quizzes change
  useEffect(() => {
    let result = [...quizzes];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(quiz => quiz.category === selectedCategory);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty) {
      result = result.filter(quiz => quiz.difficulty === selectedDifficulty);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        quiz => 
          quiz.title.toLowerCase().includes(query) || 
          quiz.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredQuizzes(result);
  }, [quizzes, selectedCategory, selectedDifficulty, searchQuery]);
  
  // Filter functions
  const filterByCategory = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);
  
  const filterByDifficulty = useCallback((difficulty: string | null) => {
    setSelectedDifficulty(difficulty);
  }, []);
  
  const searchQuizzes = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  // Refresh quizzes
  const refreshQuizzes = useCallback(async () => {
    await fetchQuizzes();
  }, [fetchQuizzes]);
  
  return {
    quizzes,
    filteredQuizzes,
    isLoading: isQuizzesLoading,
    error,
    filterByCategory,
    filterByDifficulty,
    searchQuizzes,
    refreshQuizzes,
    selectedCategory,
    selectedDifficulty,
    searchQuery
  };
}; 