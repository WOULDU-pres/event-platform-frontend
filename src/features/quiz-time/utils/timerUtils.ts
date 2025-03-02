/**
 * Timer Utilities
 * Utilities for managing timers and time-related functionality
 */

/**
 * Formats seconds into a MM:SS display
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string (MM:SS)
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Calculates the percentage of time remaining
 * @param {number} timeRemaining - Remaining time in seconds
 * @param {number} totalTime - Total time in seconds
 * @returns {number} Percentage of time remaining (0-100)
 */
export const calculateTimePercentage = (
  timeRemaining: number,
  totalTime: number
): number => {
  if (totalTime <= 0) return 0;
  return Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
};

/**
 * Returns the appropriate CSS class based on time percentage
 * @param {number} percentage - Percentage of time remaining
 * @returns {string} CSS class name for styling
 */
export const getTimeColorClass = (percentage: number): string => {
  if (percentage > 66) return 'time-plenty';
  if (percentage > 33) return 'time-warning';
  return 'time-critical';
};

/**
 * Calculates the time spent on a question
 * @param {number} startTime - Start timestamp in ms
 * @param {number} endTime - End timestamp in ms
 * @returns {number} Time spent in seconds
 */
export const calculateTimeSpent = (
  startTime: number,
  endTime: number
): number => {
  return Math.max(0, Math.floor((endTime - startTime) / 1000));
};

/**
 * Creates a timeout promise
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>} Promise that resolves after the timeout
 */
export const timeout = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 