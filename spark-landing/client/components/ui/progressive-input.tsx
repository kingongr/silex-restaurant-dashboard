import React, { forwardRef } from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ProgressiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  isValidating?: boolean;
  showValidation?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
}

export const ProgressiveInput = forwardRef<HTMLInputElement, ProgressiveInputProps>(
  ({
    label,
    error,
    touched = false,
    isValidating = false,
    showValidation = true,
    helperText,
    leftIcon,
    rightIcon,
    className,
    labelClassName,
    errorClassName,
    helperClassName,
    id,
    ...props
  },
  ref
) => {
  const hasError = touched && !!error;
  const isValid = touched && !error && !isValidating;
  const showError = showValidation && hasError;
  const showSuccess = showValidation && isValid;

  const getInputClassName = () => {
    return cn(
      'transition-all duration-200',
      {
        'border-red-500 focus:border-red-500 focus:ring-red-500/20': showError,
        'border-green-500 focus:border-green-500 focus:ring-green-500/20': showSuccess,
        'border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20': !showError && !showSuccess,
      },
      className
    );
  };

  const getRightIcon = () => {
    if (isValidating) {
      return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    }
    
    if (showSuccess) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (showError) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    return rightIcon;
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={id} 
          className={cn(
            "text-sm font-medium text-gray-700 dark:text-gray-300",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <Input
          ref={ref}
          id={id}
          className={cn(
            getInputClassName(),
            leftIcon && 'pl-10',
            getRightIcon() && 'pr-10'
          )}
          {...props}
        />
        
        {getRightIcon() && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getRightIcon()}
          </div>
        )}
      </div>
      
      {showError && (
        <p className={cn(
          "text-sm text-red-500 flex items-center gap-1",
          errorClassName
        )}>
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      
      {helperText && !showError && (
        <p className={cn(
          "text-sm text-gray-500 dark:text-gray-400",
          helperClassName
        )}>
          {helperText}
        </p>
      )}
      
      {isValidating && !showError && (
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Validating...
        </p>
      )}
    </div>
  );
});

ProgressiveInput.displayName = 'ProgressiveInput';

