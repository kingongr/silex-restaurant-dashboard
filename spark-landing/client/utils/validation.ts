// Standardized validation functions for consistent use across the app
import { parseTimeToMinutes, isWithinBusinessHours } from './time';

/**
 * Phone Number Metadata and Country-Specific Formatting
 * Supports international phone number formats with proper digit limits
 */

export interface PhoneMetadata {
  country: string;
  countryCode: string;
  digitCount: number;
  formatPattern: string;
  example: string;
  placeholder: string;
}

// Phone metadata for supported countries
export const PHONE_METADATA: Record<string, PhoneMetadata> = {
  'US': {
    country: 'US',
    countryCode: '+1',
    digitCount: 10,
    formatPattern: 'XXX-XXX-XXXX',
    example: '555-123-4567',
    placeholder: 'XXX-XXX-XXXX'
  },
  'CA': {
    country: 'CA',
    countryCode: '+1',
    digitCount: 10,
    formatPattern: 'XXX-XXX-XXXX',
    example: '555-123-4567',
    placeholder: 'XXX-XXX-XXXX'
  },
  'UK': {
    country: 'UK',
    countryCode: '+44',
    digitCount: 10,
    formatPattern: 'XXXX XXX XXX',
    example: '20 1234 5678',
    placeholder: 'XXXX XXX XXX'
  },
  'FR': {
    country: 'FR',
    countryCode: '+33',
    digitCount: 9,
    formatPattern: 'X XX XX XX XX',
    example: '1 23 45 67 89',
    placeholder: 'X XX XX XX XX'
  },
  'DE': {
    country: 'DE',
    countryCode: '+49',
    digitCount: 10,
    formatPattern: 'XXX XXXXXXXX',
    example: '30 12345678',
    placeholder: 'XXX XXXXXXXX'
  },
  'JP': {
    country: 'JP',
    countryCode: '+81',
    digitCount: 10,
    formatPattern: 'XX-XXXX-XXXX',
    example: '90-1234-5678',
    placeholder: 'XX-XXXX-XXXX'
  }
};

export const getPhoneMetadata = (countryCode: string): PhoneMetadata => {
  // Extract country from country code format like '+1-US'
  const country = countryCode.split('-')[1];
  return PHONE_METADATA[country] || PHONE_METADATA['US'];
};

export const formatPhoneNumber = (value: string, countryCode: string = '+1-US'): string => {
  const metadata = getPhoneMetadata(countryCode);
  const digits = value.replace(/\D/g, '');

  // Limit to the country's digit count
  const limitedDigits = digits.slice(0, metadata.digitCount);

  // Apply country-specific formatting
  return formatPhoneDigits(limitedDigits, metadata);
};

export const formatPhoneDigits = (digits: string, metadata: PhoneMetadata): string => {
  if (!digits) return '';

  const format = metadata.formatPattern;
  let formatted = '';
  let digitIndex = 0;

  for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
    const char = format[i];
    if (char === 'X') {
      formatted += digits[digitIndex];
      digitIndex++;
    } else {
      formatted += char;
    }
  }

  return formatted;
};

export const getPhoneMaxLength = (countryCode: string = '+1-US'): number => {
  const metadata = getPhoneMetadata(countryCode);
  return metadata.formatPattern.length;
};

export const getPhoneDigits = (formattedPhone: string): string => {
  return formattedPhone.replace(/\D/g, '');
};

/**
 * Phone Number Validation and Formatting (Legacy - for backward compatibility)
 * Formats phone numbers as (XXX) XXX-XXXX and limits to 10 digits
 */
export const formatPhoneNumberLegacy = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Limit to 10 digits
  if (digits.length > 10) {
    return value.slice(0, -1); // Remove the extra character
  }

  // Format as (XXX) XXX-XXXX
  if (digits.length >= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length >= 3) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else if (digits.length > 0) {
    return `(${digits}`;
  }
  return '';
};

export const validatePhoneNumber = (phone: string, countryCode: string = '+1-US'): boolean => {
  const metadata = getPhoneMetadata(countryCode);
  const digits = phone.replace(/\D/g, '');
  return digits.length === metadata.digitCount;
};

export const validatePhoneNumberLegacy = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10;
};

export const getPhoneError = (phone: string, countryCode: string = '+1-US'): string => {
  if (!phone) return '';
  if (!validatePhoneNumber(phone, countryCode)) {
    const metadata = getPhoneMetadata(countryCode);
    return `Please enter a valid ${metadata.digitCount}-digit phone number`;
  }
  return '';
};

export const getPhoneErrorLegacy = (phone: string): string => {
  if (!phone) return '';
  if (!validatePhoneNumberLegacy(phone)) {
    return 'Please enter a valid 10-digit phone number';
  }
  return '';
};

/**
 * Email Validation
 * Uses a comprehensive regex pattern for email validation
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getEmailError = (email: string): string => {
  if (!email) return '';
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

/**
 * Price Validation and Formatting
 * Ensures prices are always displayed with 2 decimal places
 */
export const formatPrice = (value: string | number): string => {
  if (typeof value === 'string') {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '0.00';
    return numValue.toFixed(2);
  }
  return value.toFixed(2);
};

export const validatePrice = (price: string): boolean => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= 0;
};

export const getPriceError = (price: string): string => {
  if (!price) return '';
  if (!validatePrice(price)) {
    return 'Please enter a valid price (e.g., 12.99)';
  }
  return '';
};

/**
 * Currency Input Handler
 * Allows free typing but formats on blur/enter
 */
export const handlePriceInput = (value: string): string => {
  // Allow only numbers, decimal points, and backspace
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit decimal places to 2
  if (parts[1] && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].slice(0, 2);
  }
  
  return cleanValue;
};

export const handlePriceBlur = (price: string): string => {
  if (!price) return '0.00';
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return '0.00';
  return numPrice.toFixed(2);
};

/**
 * Name Validation
 * Ensures names are not empty and contain only valid characters
 */
export const validateName = (name: string): boolean => {
  return name.trim().length > 0 && /^[a-zA-Z\s'-]+$/.test(name.trim());
};

export const getNameError = (name: string): string => {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (!validateName(name)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return '';
};

/**
 * Required Field Validation
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const getRequiredError = (value: string, fieldName: string): string => {
  if (!validateRequired(value)) {
    return `${fieldName} is required`;
  }
  return '';
};

/**
 * Enhanced validation functions for common form fields
 */

/**
 * Category Validation
 * Ensures category is selected or custom category is provided
 */
export const validateCategory = (category: string, customCategory?: string): boolean => {
  if (category === 'custom') {
    return customCategory ? customCategory.trim().length > 0 : false;
  }
  return category.trim().length > 0;
};

export const getCategoryError = (category: string, customCategory?: string): string => {
  if (!validateCategory(category, customCategory)) {
    if (category === 'custom') {
      return 'Please enter a custom category name';
    }
    return 'Please select a category';
  }
  return '';
};

/**
 * Description Validation
 * Ensures description meets minimum length requirements
 */
export const validateDescription = (description: string, minLength: number = 10): boolean => {
  return description.trim().length >= minLength;
};

export const getDescriptionError = (description: string, minLength: number = 10): string => {
  if (!validateDescription(description, minLength)) {
    return `Description must be at least ${minLength} characters long`;
  }
  return '';
};

/**
 * Table Number Validation
 * Ensures table number is a positive integer
 */
export const validateTableNumber = (tableNumber: string | number): boolean => {
  const num = typeof tableNumber === 'string' ? parseInt(tableNumber) : tableNumber;
  return !isNaN(num) && num > 0 && Number.isInteger(num);
};

export const getTableNumberError = (tableNumber: string | number): string => {
  if (!validateTableNumber(tableNumber)) {
    return 'Please enter a valid table number (positive integer)';
  }
  return '';
};

/**
 * Capacity Validation
 * Ensures capacity is a positive integer within reasonable range
 */
export const validateCapacity = (capacity: string | number, min: number = 1, max: number = 20): boolean => {
  const num = typeof capacity === 'string' ? parseInt(capacity) : capacity;
  return !isNaN(num) && num >= min && num <= max && Number.isInteger(num);
};

export const getCapacityError = (capacity: string | number, min: number = 1, max: number = 20): string => {
  if (!validateCapacity(capacity, min, max)) {
    return `Capacity must be between ${min} and ${max} people`;
  }
  return '';
};

/**
 * Date Validation
 * Ensures date is not in the past
 */
export const validateFutureDate = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

export const getFutureDateError = (date: string): string => {
  if (!validateFutureDate(date)) {
    return 'Please select a future date';
  }
  return '';
};

/**
 * Time Validation
 * Ensures time is within business hours (configurable)
 */
export const validateBusinessHours = (
  time: string, 
  openHour: number = 6, 
  closeHour: number = 23
): boolean => {
  return isWithinBusinessHours(time, openHour, closeHour);
};

export const getBusinessHoursError = (
  time: string, 
  openHour: number = 6, 
  closeHour: number = 23
): string => {
  if (!validateBusinessHours(time, openHour, closeHour)) {
    return `Please select a time between ${openHour}:00 and ${closeHour}:00`;
  }
  return '';
};

/**
 * Party Size Validation
 * Ensures party size is within reasonable range
 */
export const validatePartySize = (partySize: string | number, min: number = 1, max: number = 20): boolean => {
  const num = typeof partySize === 'string' ? parseInt(partySize) : partySize;
  return !isNaN(num) && num >= min && num <= max && Number.isInteger(num);
};

export const getPartySizeError = (partySize: string | number, min: number = 1, max: number = 20): string => {
  if (!validatePartySize(partySize, min, max)) {
    return `Party size must be between ${min} and ${max} people`;
  }
  return '';
};

/**
 * Form validation helper that returns all errors for a form
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = (validations: Record<string, { value: any; validator: (value: any) => boolean; errorMessage: string }>): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.entries(validations).forEach(([fieldName, validation]) => {
    if (!validation.validator(validation.value)) {
      errors[fieldName] = validation.errorMessage;
      isValid = false;
    }
  });

  return { isValid, errors };
};
