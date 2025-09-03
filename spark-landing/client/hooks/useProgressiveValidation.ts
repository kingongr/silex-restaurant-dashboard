import { useState, useEffect, useCallback, useRef } from 'react';

interface ValidationRule<T> {
  field: keyof T;
  validator: (value: any) => boolean;
  errorMessage: string;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnSubmit?: boolean;
}

interface ValidationState<T> {
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValidating: Partial<Record<keyof T, boolean>>;
  isFormValid: boolean;
  hasErrors: boolean;
}

interface ProgressiveValidationOptions<T> {
  rules: ValidationRule<T>[];
  validateOnMount?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  debounceDelay?: number;
}

export function useProgressiveValidation<T>(
  data: T,
  options: ProgressiveValidationOptions<T>
) {
  const {
    rules,
    validateOnMount = false,
    validateOnBlur = true,
    validateOnChange = false,
    debounceDelay = 300
  } = options;

  const [validationState, setValidationState] = useState<ValidationState<T>>({
    errors: {},
    touched: {},
    isValidating: {},
    isFormValid: false,
    hasErrors: false
  });

  const validationTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Validate a single field
  const validateField = useCallback((field: keyof T, value: any): string => {
    const rule = rules.find(r => r.field === field);
    if (!rule) return '';

    if (!rule.validator(value)) {
      return rule.errorMessage;
    }

    return '';
  }, [rules]);

  // Validate multiple fields
  const validateFields = useCallback((fields: (keyof T)[]): Partial<Record<keyof T, string>> => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    fields.forEach(field => {
      const value = (data as any)[field];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  }, [data, validateField]);

  // Validate all fields
  const validateAll = useCallback((): Partial<Record<keyof T, string>> => {
    const allFields = rules.map(rule => rule.field);
    return validateFields(allFields);
  }, [rules, validateFields]);

  // Debounced validation for real-time feedback
  const debouncedValidate = useCallback((field: keyof T, value: any) => {
    // Clear existing timeout
    if (validationTimeouts.current[field as string]) {
      clearTimeout(validationTimeouts.current[field as string]);
    }

    // Set new timeout
    validationTimeouts.current[field as string] = setTimeout(() => {
      const error = validateField(field, value);
      setValidationState(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: error },
        isValidating: { ...prev.isValidating, [field]: false }
      }));
    }, debounceDelay);

    // Set validating state immediately
    setValidationState(prev => ({
      ...prev,
      isValidating: { ...prev.isValidating, [field]: true }
    }));
  }, [validateField, debounceDelay]);

  // Handle field change with progressive validation
  const handleFieldChange = useCallback((field: keyof T, value: any) => {
    // Mark field as touched
    setValidationState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true }
    }));

    // Validate on change if enabled
    if (validateOnChange) {
      debouncedValidate(field, value);
    }
  }, [validateOnChange, debouncedValidate]);

  // Handle field blur with immediate validation
  const handleFieldBlur = useCallback((field: keyof T, value: any) => {
    if (!validateOnBlur) return;

    // Clear any pending debounced validation
    if (validationTimeouts.current[field as string]) {
      clearTimeout(validationTimeouts.current[field as string]);
    }

    // Validate immediately
    const error = validateField(field, value);
    setValidationState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
      isValidating: { ...prev.isValidating, [field]: false }
    }));
  }, [validateOnBlur, validateField]);

  // Handle form submission validation
  const validateOnSubmit = useCallback((): boolean => {
    const allErrors = validateAll();
    const hasErrors = Object.keys(allErrors).length > 0;
    
    setValidationState(prev => ({
      ...prev,
      errors: allErrors,
      hasErrors,
      isFormValid: !hasErrors
    }));

    return !hasErrors;
  }, [validateAll]);

  // Validate specific step (for multi-step forms)
  const validateStep = useCallback((stepFields: (keyof T)[]): boolean => {
    const stepErrors = validateFields(stepFields);
    const hasStepErrors = Object.keys(stepErrors).length > 0;
    
    setValidationState(prev => ({
      ...prev,
      errors: { ...prev.errors, ...stepErrors },
      hasErrors: hasStepErrors || prev.hasErrors
    }));

    return !hasStepErrors;
  }, [validateFields]);

  // Clear validation for specific field
  const clearFieldError = useCallback((field: keyof T) => {
    setValidationState(prev => ({
      ...prev,
      errors: { ...prev.errors, [field]: '' },
      isValidating: { ...prev.isValidating, [field]: false }
    }));
  }, []);

  // Clear all validation errors
  const clearAllErrors = useCallback(() => {
    setValidationState(prev => ({
      ...prev,
      errors: {},
      isValidating: {},
      hasErrors: false,
      isFormValid: false
    }));
  }, []);

  // Reset validation state
  const resetValidation = useCallback(() => {
    setValidationState({
      errors: {},
      touched: {},
      isValidating: {},
      isFormValid: false,
      hasErrors: false
    });
  }, []);

  // Get field validation state
  const getFieldState = useCallback((field: keyof T) => {
    const error = validationState.errors[field];
    const touched = validationState.touched[field];
    const isValidating = validationState.isValidating[field];
    
    return {
      error,
      touched,
      isValidating,
      hasError: !!error,
      isValid: !error && touched,
      showError: touched && !!error
    };
  }, [validationState]);

  // Validate on mount if enabled
  useEffect(() => {
    if (validateOnMount) {
      const allErrors = validateAll();
      const hasErrors = Object.keys(allErrors).length > 0;
      
      setValidationState(prev => ({
        ...prev,
        errors: allErrors,
        hasErrors,
        isFormValid: !hasErrors
      }));
    }
  }, [validateOnMount, validateAll]);

  // Update form validity when errors change
  useEffect(() => {
    const hasErrors = Object.keys(validationState.errors).some(key => 
      validationState.errors[key as keyof T]
    );
    
    setValidationState(prev => ({
      ...prev,
      hasErrors,
      isFormValid: !hasErrors
    }));
  }, [validationState.errors]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  return {
    // State
    errors: validationState.errors,
    touched: validationState.touched,
    isValidating: validationState.isValidating,
    isFormValid: validationState.isFormValid,
    hasErrors: validationState.hasErrors,
    
    // Actions
    handleFieldChange,
    handleFieldBlur,
    validateOnSubmit,
    validateStep,
    validateField,
    validateFields,
    validateAll,
    clearFieldError,
    clearAllErrors,
    resetValidation,
    
    // Utilities
    getFieldState
  };
}

