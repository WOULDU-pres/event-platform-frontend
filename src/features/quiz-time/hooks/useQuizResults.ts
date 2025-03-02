import { useEffect, useCallback } from 'react';
import { useQuizTimeStore } from '../stores';
import { QuizResult } from '../types';

export interface UseQuizResultsReturn {
  results: QuizResult[];
  isLoading: boolean;
  error: string | null;
  getResultById: (resultId: string) => QuizResult | undefined;
  refreshResults: () => Promise<void>;
}

/**
 * Hook for managing quiz results
 */
export const useQuizResults = (): UseQuizResultsReturn => {
  const store = useQuizTimeStore();
  
  // Load results initially
  useEffect(() => {
    store.fetchResults();
  }, [store]);
  
  // Get a specific result by ID
  const getResultById = useCallback((resultId: string): QuizResult | undefined => {
    return store.results.find(result => result.resultId === resultId);
  }, [store.results]);
  
  // Refresh results
  const refreshResults = useCallback(async () => {
    await store.fetchResults();
  }, [store]);
  
  return {
    results: store.results,
    isLoading: store.isResultsLoading,
    error: store.error,
    getResultById,
    refreshResults
  };
}; 