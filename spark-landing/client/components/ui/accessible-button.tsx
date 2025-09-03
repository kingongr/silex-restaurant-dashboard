import React, { forwardRef, useState, useCallback } from 'react';
import { Button } from './button';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  status?: 'idle' | 'loading' | 'success' | 'error';
  ariaLabel?: string;
  ariaDescription?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaControls?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  announceChanges?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    variant = 'default',
    size = 'default',
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    status = 'idle',
    ariaLabel,
    ariaDescription,
    ariaExpanded,
    ariaPressed,
    ariaControls,
    ariaLive = 'polite',
    announceChanges = true,
    className,
    children,
    disabled,
    onClick,
    onFocus,
    onBlur,
    ...props
  },
  ref
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Handle button press state for screen readers
  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Handle focus state
  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(true);
    if (announceChanges && ariaLabel) {
      // Announce button focus to screen readers
      const announcement = `${ariaLabel} button focused${ariaDescription ? `. ${ariaDescription}` : ''}`;
      announceToScreenReader(announcement);
    }
    onFocus?.(e);
  }, [announceChanges, ariaLabel, ariaDescription, onFocus]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(false);
    setIsPressed(false);
    onBlur?.(e);
  }, [onBlur]);

  // Announce changes to screen readers
  const announceToScreenReader = useCallback((message: string) => {
    if (!announceChanges) return;

    let liveRegion = document.getElementById('button-accessibility-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'button-accessibility-live-region';
      liveRegion.setAttribute('aria-live', ariaLive);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;
  }, [announceChanges, ariaLive]);

  // Get status-based styling
  const getStatusClasses = () => {
    switch (status) {
      case 'success':
        return 'border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'error':
        return 'border-red-500 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'loading':
        return 'opacity-75 cursor-wait';
      default:
        return '';
    }
  };

  // Get focus indicator classes
  const getFocusClasses = () => {
    if (!isFocused) return '';
    
    return cn(
      'ring-2 ring-offset-2',
      {
        'ring-blue-500': variant === 'default' || variant === 'secondary' || variant === 'link',
        'ring-red-500': variant === 'destructive',
        'ring-gray-500': variant === 'outline' || variant === 'ghost'
      }
    );
  };

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Get loading text
  const getLoadingText = () => {
    if (loadingText) return loadingText;
    if (typeof children === 'string') return `Loading ${children.toLowerCase()}`;
    return 'Loading...';
  };

  // Get button content
  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="sr-only">{getLoadingText()}</span>
        </>
      );
    }

    return (
      <>
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className="flex-1">{children}</span>
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </>
    );
  };

  return (
    <>
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={isDisabled}
        className={cn(
          'relative transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          getStatusClasses(),
          getFocusClasses(),
          className
        )}
        onClick={onClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? `button-desc-${Math.random().toString(36).substr(2, 9)}` : undefined}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed || isPressed}
        aria-controls={ariaControls}
        aria-live={ariaLive}
        {...props}
      >
        {getButtonContent()}
      </Button>

      {/* Accessibility Description */}
      {ariaDescription && (
        <div
          id={`button-desc-${Math.random().toString(36).substr(2, 9)}`}
          className="sr-only"
        >
          {ariaDescription}
        </div>
      )}

      {/* Accessibility Live Region */}
      <div
        id="button-accessibility-live-region"
        aria-live={ariaLive}
        aria-atomic="true"
        className="sr-only"
      />
    </>
  );
});

AccessibleButton.displayName = 'AccessibleButton';
