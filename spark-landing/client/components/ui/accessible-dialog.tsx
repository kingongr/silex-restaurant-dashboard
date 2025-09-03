import React, { forwardRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { useAccessibility } from '../../hooks/useAccessibility';
import { cn } from '../../lib/utils';

interface AccessibleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  announceChanges?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
}

export const AccessibleDialog = forwardRef<HTMLDivElement, AccessibleDialogProps>(
  ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'lg',
    closeOnEscape = true,
    closeOnOutsideClick = true,
    trapFocus = true,
    autoFocus = true,
    restoreFocus = true,
    announceChanges = true,
    className,
    contentClassName,
    headerClassName,
    role = 'dialog',
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-labelledby': ariaLabelledby,
    ...props
  },
  ref
  ) => {
    const {
      containerRef,
      accessibilityState,
      announceChange
    } = useAccessibility(isOpen, onClose, {
      trapFocus,
      autoFocus,
      closeOnEscape,
      closeOnOutsideClick,
      announceChanges,
      restoreFocus
    });

    // Announce dialog state changes
    useEffect(() => {
      if (isOpen && announceChanges) {
        announceChange(`${title} dialog opened. ${description ? description + '. ' : ''}Use Tab to navigate, Escape to close.`);
      }
    }, [isOpen, title, description, announceChanges, announceChange]);

    // Get size classes
    const getSizeClasses = () => {
      switch (size) {
        case 'sm': return 'max-w-sm';
        case 'md': return 'max-w-md';
        case 'lg': return 'max-w-lg';
        case 'xl': return 'max-w-xl';
        case '2xl': return 'max-w-2xl';
        case 'full': return 'max-w-full mx-4';
        default: return 'max-w-lg';
      }
    };

    // Generate unique IDs for accessibility
    const titleId = `dialog-title-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = `dialog-description-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          ref={(node) => {
            // Merge refs
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            if (containerRef.current !== node) {
              (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }
          }}
          className={cn(
            getSizeClasses(),
            'max-h-[90vh] overflow-y-auto',
            className
          )}
          contentClassName={cn(
            'relative',
            contentClassName
          )}
          role={role}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby || descriptionId}
          aria-labelledby={ariaLabelledby || titleId}
          aria-modal="true"
          tabIndex={-1}
          {...props}
        >
          {/* Header */}
          <DialogHeader className={cn('sticky top-0 bg-white dark:bg-gray-900 z-10', headerClassName)}>
            <DialogTitle
              id={titleId}
              className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription
                id={descriptionId}
                className="text-gray-600 dark:text-gray-400"
              >
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Content */}
          <div className="flex-1">
            {children}
          </div>

          {/* Accessibility Live Region */}
          <div
            id="accessibility-live-region"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />

          {/* Focus Management Indicator */}
          {accessibilityState.isTrapped && (
            <div
              className="sr-only"
              aria-live="polite"
              aria-atomic="true"
            >
              Focus is trapped within this dialog. Use Tab to navigate between elements.
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);

AccessibleDialog.displayName = 'AccessibleDialog';

