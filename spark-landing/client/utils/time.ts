/**
 * Time utility functions for consistent time handling across the application
 */

/**
 * Parses a time string in "H:MM" or "HH:MM" format to minutes since midnight
 * @param time - Time string in "H:MM" or "HH:MM" format (e.g., "9:05" or "09:05")
 * @returns Number of minutes since midnight, or null for invalid input
 */
export const parseTimeToMinutes = (time: string): number | null => {
  if (!time || typeof time !== 'string') {
    return null;
  }

  const timeParts = time.split(':');
  if (timeParts.length !== 2) {
    return null;
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  // Validate hours and minutes are valid numbers and within valid ranges
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
};

/**
 * Computes a suggested prep start time by subtracting offset minutes from the given time
 * @param time - Time string in "HH:MM" format
 * @param offsetMinutes - Number of minutes to subtract (default: 30)
 * @param fallbackMinutes - Optional fallback value to return if time parsing fails
 * @returns Number of minutes since midnight for the suggested start time, or null/fallback for invalid input
 */
export const computeSuggestedPrepStart = (
  time: string,
  offsetMinutes: number = 30,
  fallbackMinutes?: number
): number | null => {
  const timeInMinutes = parseTimeToMinutes(time);
  if (timeInMinutes === null) {
    return fallbackMinutes !== undefined ? fallbackMinutes : null;
  }

  return Math.max(0, timeInMinutes - offsetMinutes);
};

/**
 * Formats minutes since midnight to "HH:MM" format
 * @param minutes - Number of minutes since midnight
 * @returns Time string in "HH:MM" format
 */
export const formatMinutesToTime = (minutes: number): string => {
  if (isNaN(minutes) || minutes < 0) {
    return '00:00';
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Validates if a time string is in correct "HH:MM" format
 * @param time - Time string to validate
 * @returns True if the time format is valid
 */
export const isValidTimeFormat = (time: string): boolean => {
  if (!time || typeof time !== 'string') {
    return false;
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Validates if a time is within business hours
 * @param time - Time string in "HH:MM" format
 * @param openHour - Opening hour (0-23, default: 6)
 * @param closeHour - Closing hour (0-23, default: 23)
 * @returns True if the time is within business hours
 */
export const isWithinBusinessHours = (
  time: string,
  openHour: number = 6,
  closeHour: number = 23
): boolean => {
  const timeInMinutes = parseTimeToMinutes(time);
  if (timeInMinutes === null) {
    return false;
  }

  const openInMinutes = openHour * 60;
  const closeInMinutes = closeHour * 60;

  return timeInMinutes >= openInMinutes && timeInMinutes <= closeInMinutes;
};
