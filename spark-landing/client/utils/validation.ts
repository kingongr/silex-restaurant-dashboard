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
