import { useEffect, useRef, useCallback } from 'react';

// Hook for managing focus in modals
export const useModalFocus = (isOpen: boolean, autoFocus: boolean = true) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;

      if (autoFocus && modalRef.current) {
        // Find the first focusable element in the modal
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusableElement = focusableElements[0] as HTMLElement;
        if (firstFocusableElement) {
          firstFocusableElement.focus();
        } else {
          // Fallback to modal container
          modalRef.current.focus();
        }
      }
    } else {
      // Restore focus when modal closes
      if (previousFocusRef.current && 'focus' in previousFocusRef.current) {
        (previousFocusRef.current as HTMLElement).focus();
      }
    }
  }, [isOpen, autoFocus]);

  // Handle escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  return {
    modalRef,
    focusModal: () => modalRef.current?.focus(),
  };
};

// Hook for managing form field accessibility
export const useFormAccessibility = () => {
  const announceError = useCallback((fieldId: string, errorMessage: string) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', `${fieldId}-error`);

      // Update or create error message element
      let errorElement = document.getElementById(`${fieldId}-error`);
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `${fieldId}-error`;
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        errorElement.className = 'sr-only'; // Screen reader only
        field.parentNode?.appendChild(errorElement);
      }
      errorElement.textContent = errorMessage;
    }
  }, []);

  const clearError = useCallback((fieldId: string) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');

      const errorElement = document.getElementById(`${fieldId}-error`);
      if (errorElement) {
        errorElement.remove();
      }
    }
  }, []);

  const announceSuccess = useCallback((fieldId: string, successMessage: string) => {
    const field = document.getElementById(fieldId);
    if (field) {
      // Remove error state
      field.removeAttribute('aria-invalid');

      // Announce success (optional - for important confirmations)
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = successMessage;

      document.body.appendChild(announcement);

      // Clean up after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, []);

  return {
    announceError,
    clearError,
    announceSuccess,
  };
};

// Hook for managing ARIA live regions
export const useAriaLive = (priority: 'polite' | 'assertive' = 'polite') => {
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  }, []);

  const clear = useCallback(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = '';
    }
  }, []);

  return {
    liveRegionRef,
    announce,
    clear,
    LiveRegion: () => (
      <div
        ref={liveRegionRef}
        aria-live={priority}
        aria-atomic="true"
        className="sr-only"
      />
    ),
  };
};

// Hook for managing skip links
export const useSkipLinks = () => {
  useEffect(() => {
    // Create skip links for keyboard navigation
    const skipLinks = [
      { href: '#main-content', text: 'Skip to main content' },
      { href: '#navigation', text: 'Skip to navigation' },
      { href: '#search', text: 'Skip to search' },
    ];

    skipLinks.forEach(({ href, text }) => {
      const existingLink = document.querySelector(`a[href="${href}"]`);
      if (!existingLink) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        link.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded';
        document.body.insertBefore(link, document.body.firstChild);
      }
    });

    // Add focus styles for skip links
    const style = document.createElement('style');
    style.textContent = `
      .skip-link:focus {
        position: static !important;
        width: auto !important;
        height: auto !important;
        clip: auto !important;
        clip-path: none !important;
        overflow: visible !important;
        white-space: normal !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup skip links on unmount
      skipLinks.forEach(({ href }) => {
        const link = document.querySelector(`a[href="${href}"]`);
        if (link) {
          link.remove();
        }
      });
      document.head.removeChild(style);
    };
  }, []);
};

// Hook for managing modal accessibility
export const useModalAccessibility = (isOpen: boolean, title: string) => {
  const { modalRef } = useModalFocus(isOpen);
  const { LiveRegion, announce } = useAriaLive('assertive');

  useEffect(() => {
    if (isOpen) {
      // Announce modal opening
      announce(`${title} dialog opened`);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Set modal as the main content for screen readers
      const modal = modalRef.current;
      if (modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');
        modal.setAttribute('aria-describedby', 'modal-description');
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Announce modal closing
      announce(`${title} dialog closed`);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, title, announce, modalRef]);

  return {
    modalRef,
    LiveRegion,
    announce,
  };
};

// Hook for managing form submission accessibility
export const useFormSubmission = () => {
  const { announce } = useAriaLive('assertive');

  const announceSubmissionStart = useCallback((formName: string) => {
    announce(`Submitting ${formName} form...`);
  }, [announce]);

  const announceSubmissionSuccess = useCallback((formName: string, message?: string) => {
    announce(message || `${formName} form submitted successfully`);
  }, [announce]);

  const announceSubmissionError = useCallback((formName: string, errorMessage: string) => {
    announce(`Error submitting ${formName} form: ${errorMessage}`);
  }, [announce]);

  return {
    announceSubmissionStart,
    announceSubmissionSuccess,
    announceSubmissionError,
  };
};

// Utility function to create accessible form field props
export const createAccessibleFieldProps = (
  id: string,
  label: string,
  error?: string,
  description?: string,
  required?: boolean
) => {
  const baseProps = {
    id,
    'aria-labelledby': `${id}-label`,
    'aria-required': required || false,
  };

  if (error) {
    return {
      ...baseProps,
      'aria-invalid': true,
      'aria-describedby': `${id}-error`,
    };
  }

  if (description) {
    return {
      ...baseProps,
      'aria-describedby': `${id}-description`,
    };
  }

  return baseProps;
};

// Utility function to create accessible button props
export const createAccessibleButtonProps = (
  label: string,
  loading?: boolean,
  disabled?: boolean
) => {
  return {
    'aria-label': loading ? `${label} - Loading` : label,
    'aria-disabled': disabled || loading || false,
    disabled: disabled || loading || false,
  };
};