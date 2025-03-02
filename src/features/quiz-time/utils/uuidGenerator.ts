/**
 * UUID Generator utility
 * Generates a UUID for user identification
 */

/**
 * Generates a UUID v4
 * @returns {string} A random UUID
 */
export const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Generates a user UUID prefixed with 'quiz-time-user-'
 * @returns {string} A user-specific UUID
 */
export const generateUserUuid = (): string => {
  return `quiz-time-user-${generateUuid()}`;
};

/**
 * Checks if a string is a valid UUID format
 * @param {string} uuid - The UUID to validate
 * @returns {boolean} True if the UUID is valid
 */
export const isValidUuid = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Extracts the base UUID from a prefixed UUID
 * @param {string} prefixedUuid - The prefixed UUID
 * @returns {string} The base UUID without prefix
 */
export const extractBaseUuid = (prefixedUuid: string): string => {
  const parts = prefixedUuid.split('-');
  
  // Skip the prefix parts and join the UUID parts
  if (parts.length > 5) {
    return parts.slice(-5).join('-');
  }
  
  return prefixedUuid;
}; 