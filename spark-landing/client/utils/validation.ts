// Standardized validation functions for consistent use across the app

/**
 * Phone Number Validation and Formatting
 * Formats phone numbers as (XXX) XXX-XXXX and limits to 10 digits
 */
export const formatPhoneNumber = (value: string): string => {
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

export const validatePhoneNumber = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10;
};

export const getPhoneError = (phone: string): string => {
  if (!phone) return '';
  if (!validatePhoneNumber(phone)) {
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
  const [hours, minutes] = time.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;
  const openInMinutes = openHour * 60;
  const closeInMinutes = closeHour * 60;
  
  return timeInMinutes >= openInMinutes && timeInMinutes <= closeInMinutes;
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
