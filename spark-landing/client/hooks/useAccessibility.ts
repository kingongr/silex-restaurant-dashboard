import { useEffect, useRef, useCallback, useState } from 'react';

interface AccessibilityOptions {
  trapFocus?: boolean;
  autoFocus?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  announceChanges?: boolean;
  restoreFocus?: boolean;
  focusFirstElement?: boolean;
  focusLastElement?: boolean;
}

interface AccessibilityState {
  isFocused: boolean;
  focusableElements: HTMLElement[];
  currentFocusIndex: number;
  isTrapped: boolean;
}

export function useAccessibility(
  isOpen: boolean,
  onClose?: () => void,
  options: AccessibilityOptions = {}
) {
  const {
    trapFocus = true,
    autoFocus = true,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    announceChanges = true,
    restoreFocus = true,
    focusFirstElement = true,
    focusLastElement = false
  } = options;

  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    isFocused: false,
    focusableElements: [],
    currentFocusIndex: 0,
    isTrapped: false
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      'area[href]',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    const elements = containerRef.current.querySelectorAll(focusableSelectors.join(', '));
    return Array.from(elements) as HTMLElement[];
  }, []);

  // Focus a specific element
  const focusElement = useCallback((element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
      setAccessibilityState(prev => ({
        ...prev,
        isFocused: true,
        currentFocusIndex: focusableElementsRef.current.indexOf(element)
      }));
    }
  }, []);

  // Focus the first focusable element
  const focusFirstElementCallback = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      focusElement(elements[0]);
    }
  }, [getFocusableElements, focusElement]);

  // Focus the last focusable element
  const focusLastElementCallback = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      focusElement(elements[elements.length - 1]);
    }
  }, [getFocusableElements, focusElement]);

  // Focus the next element
  const focusNextElement = useCallback(() => {
    const elements = focusableElementsRef.current;
    if (elements.length === 0) return;

    const nextIndex = (accessibilityState.currentFocusIndex + 1) % elements.length;
    focusElement(elements[nextIndex]);
  }, [accessibilityState.currentFocusIndex, focusElement]);

  // Focus the previous element
  const focusPreviousElement = useCallback(() => {
    const elements = focusableElementsRef.current;
    if (elements.length === 0) return;

    const prevIndex = accessibilityState.currentFocusIndex === 0 
      ? elements.length - 1 
      : accessibilityState.currentFocusIndex - 1;
    focusElement(elements[prevIndex]);
  }, [accessibilityState.currentFocusIndex, focusElement]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Tab':
        if (trapFocus) {
          event.preventDefault();
          if (event.shiftKey) {
            focusPreviousElement();
          } else {
            focusNextElement();
          }
        }
        break;

      case 'Escape':
        if (closeOnEscape && onClose) {
          event.preventDefault();
          onClose();
        }
        break;

      case 'ArrowDown':
      case 'ArrowRight':
        if (trapFocus) {
          event.preventDefault();
          focusNextElement();
        }
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        if (trapFocus) {
          event.preventDefault();
          focusPreviousElement();
        }
        break;

      case 'Home':
        if (trapFocus) {
          event.preventDefault();
          focusFirstElementCallback();
        }
        break;

      case 'End':
        if (trapFocus) {
          event.preventDefault();
          focusLastElementCallback();
        }
        break;
    }
  }, [
    isOpen,
    trapFocus,
    closeOnEscape,
    onClose,
    focusNextElement,
    focusPreviousElement,
    focusFirstElement,
    focusLastElement
  ]);

  // Handle outside click
  const handleOutsideClick = useCallback((event: MouseEvent) => {
    if (!closeOnOutsideClick || !containerRef.current || !onClose) return;

    if (!containerRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [closeOnOutsideClick, onClose]);

  // Announce changes to screen readers
  const announceChange = useCallback((message: string) => {
    if (!announceChanges) return;

    // Create or update live region
    let liveRegion = document.getElementById('accessibility-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;
  }, [announceChanges]);

  // Save current focus before opening
  const saveCurrentFocus = useCallback(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [restoreFocus]);

  // Restore focus after closing
  const restorePreviousFocus = useCallback(() => {
    if (restoreFocus && previousFocusRef.current) {
      focusElement(previousFocusRef.current);
      previousFocusRef.current = null;
    }
  }, [restoreFocus, focusElement]);

  // Initialize accessibility when modal opens
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      saveCurrentFocus();

      // Get focusable elements
      const elements = getFocusableElements();
      focusableElementsRef.current = elements;

      // Update state
      setAccessibilityState(prev => ({
        ...prev,
        focusableElements: elements,
        isTrapped: trapFocus
      }));

      // Auto-focus first element
      if (autoFocus && focusFirstElement && elements.length > 0) {
        setTimeout(() => focusFirstElementCallback(), 100);
      }

      // Announce modal opening
      if (announceChanges) {
        announceChange('Modal opened. Use Tab to navigate, Escape to close.');
      }

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleOutsideClick);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    } else {
      // Restore focus when modal closes
      restorePreviousFocus();
    }
  }, [
    isOpen,
    autoFocus,
    focusFirstElement,
    trapFocus,
    announceChanges,
    announceChange,
    handleKeyDown,
    handleOutsideClick,
    saveCurrentFocus,
    restorePreviousFocus
  ]);

  // Update focusable elements when content changes
  useEffect(() => {
    if (isOpen) {
      const elements = getFocusableElements();
      focusableElementsRef.current = elements;
      setAccessibilityState(prev => ({
        ...prev,
        focusableElements: elements
      }));
    }
  }, [isOpen, getFocusableElements]);

  return {
    // Refs
    containerRef,
    
    // State
    accessibilityState,
    
    // Actions
    focusElement,
    focusFirstElement: focusFirstElementCallback,
    focusLastElement: focusLastElementCallback,
    focusNextElement,
    focusPreviousElement,
    announceChange,
    
    // Utilities
    getFocusableElements
  };
}
