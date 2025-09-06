import { useEffect, useRef, useCallback } from 'react';

// Hook for managing file input cleanup
export const useFileInputCleanup = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      clearFileInput();
    };
  }, [clearFileInput]);

  return {
    fileInputRef,
    clearFileInput,
  };
};

// Hook for managing multiple file inputs cleanup
export const useMultiFileInputCleanup = (count: number = 1) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>(Array(count).fill(null));

  const setFileInputRef = useCallback((index: number) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[index] = el;
  }, []);

  const clearAllFileInputs = useCallback(() => {
    fileInputRefs.current.forEach(input => {
      if (input) {
        input.value = '';
      }
    });
  }, []);

  const clearFileInput = useCallback((index: number) => {
    const input = fileInputRefs.current[index];
    if (input) {
      input.value = '';
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup all file inputs on unmount
      clearAllFileInputs();
    };
  }, [clearAllFileInputs]);

  return {
    setFileInputRef,
    clearFileInput,
    clearAllFileInputs,
    fileInputRefs: fileInputRefs.current,
  };
};

// Hook for managing event listeners cleanup
export const useEventListenerCleanup = () => {
  const listenersRef = useRef<(() => void)[]>([]);

  const addEventListener = useCallback(
    (element: Element | Window | Document, event: string, handler: EventListener, options?: boolean | AddEventListenerOptions) => {
      element.addEventListener(event, handler, options);

      const cleanup = () => {
        element.removeEventListener(event, handler, options);
      };

      listenersRef.current.push(cleanup);
      return cleanup;
    },
    []
  );

  const removeEventListener = useCallback((cleanup: () => void) => {
    cleanup();
    listenersRef.current = listenersRef.current.filter(fn => fn !== cleanup);
  }, []);

  const cleanupAll = useCallback(() => {
    listenersRef.current.forEach(cleanup => cleanup());
    listenersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      cleanupAll();
    };
  }, [cleanupAll]);

  return {
    addEventListener,
    removeEventListener,
    cleanupAll,
  };
};

// Hook for managing timeout/intervals cleanup
export const useTimeoutCleanup = () => {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const setCleanupTimeout = useCallback((callback: () => void, delay: number) => {
    const timeout = setTimeout(() => {
      timeoutsRef.current.delete(timeout);
      callback();
    }, delay);

    timeoutsRef.current.add(timeout);
    return timeout;
  }, []);

  const setCleanupInterval = useCallback((callback: () => void, delay: number) => {
    const interval = setInterval(callback, delay);
    intervalsRef.current.add(interval);
    return interval;
  }, []);

  const clearCleanupTimeout = useCallback((timeout: NodeJS.Timeout) => {
    clearTimeout(timeout);
    timeoutsRef.current.delete(timeout);
  }, []);

  const clearCleanupInterval = useCallback((interval: NodeJS.Timeout) => {
    clearInterval(interval);
    intervalsRef.current.delete(interval);
  }, []);

  const cleanupAll = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();

    // Clear all intervals
    intervalsRef.current.forEach(interval => clearInterval(interval));
    intervalsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      cleanupAll();
    };
  }, [cleanupAll]);

  return {
    setCleanupTimeout,
    setCleanupInterval,
    clearCleanupTimeout,
    clearCleanupInterval,
    cleanupAll,
  };
};

// Hook for managing modal-specific cleanup
export const useModalCleanup = () => {
  const { cleanupAll: cleanupEventListeners } = useEventListenerCleanup();
  const { cleanupAll: cleanupTimers } = useTimeoutCleanup();
  const { clearAllFileInputs } = useMultiFileInputCleanup();

  const cleanupModal = useCallback(() => {
    // Cleanup file inputs
    clearAllFileInputs();

    // Cleanup event listeners
    cleanupEventListeners();

    // Cleanup timers
    cleanupTimers();

    // Additional modal-specific cleanup
    // - Clear any pending API requests
    // - Reset form state
    // - Clear any cached data
  }, [clearAllFileInputs, cleanupEventListeners, cleanupTimers]);

  useEffect(() => {
    return () => {
      cleanupModal();
    };
  }, [cleanupModal]);

  return {
    cleanupModal,
  };
};

// Hook for managing form data cleanup
export const useFormDataCleanup = <T extends Record<string, any>>(
  initialState: T
) => {
  const formDataRef = useRef<T>(initialState);

  const resetFormData = useCallback(() => {
    formDataRef.current = { ...initialState };

    // Clear any file data specifically
    Object.keys(formDataRef.current).forEach(key => {
      if (formDataRef.current[key] instanceof File) {
        formDataRef.current[key] = null as any;
      }
      if (Array.isArray(formDataRef.current[key]) && formDataRef.current[key].length > 0) {
        const firstItem = formDataRef.current[key][0];
        if (firstItem instanceof File) {
          formDataRef.current[key] = [] as any;
        }
      }
    });
  }, [initialState]);

  const cleanupFormFiles = useCallback(() => {
    Object.keys(formDataRef.current).forEach(key => {
      if (formDataRef.current[key] instanceof File) {
        // Create object URL revocation for file objects
        if (typeof formDataRef.current[key] === 'object' && formDataRef.current[key] !== null) {
          const fileObj = formDataRef.current[key] as any;
          if (fileObj.url && typeof fileObj.url === 'string') {
            URL.revokeObjectURL(fileObj.url);
          }
        }
        formDataRef.current[key] = null as any;
      }
      if (Array.isArray(formDataRef.current[key])) {
        formDataRef.current[key].forEach((item: any) => {
          if (item instanceof File) {
            // Revoke object URLs for file arrays
            if (item.url) {
              URL.revokeObjectURL(item.url);
            }
          }
        });
        formDataRef.current[key] = [] as any;
      }
    });
  }, []);

  const getCleanFormData = useCallback(() => {
    return { ...formDataRef.current };
  }, []);

  useEffect(() => {
    return () => {
      cleanupFormFiles();
    };
  }, [cleanupFormFiles]);

  return {
    resetFormData,
    cleanupFormFiles,
    getCleanFormData,
    formData: formDataRef.current,
  };
};

// Hook for managing image preview cleanup
export const useImagePreviewCleanup = () => {
  const previewUrlsRef = useRef<Set<string>>(new Set());

  const createPreviewUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file);
    previewUrlsRef.current.add(url);
    return url;
  }, []);

  const revokePreviewUrl = useCallback((url: string) => {
    URL.revokeObjectURL(url);
    previewUrlsRef.current.delete(url);
  }, []);

  const cleanupAllPreviews = useCallback(() => {
    previewUrlsRef.current.forEach(url => {
      URL.revokeObjectURL(url);
    });
    previewUrlsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      cleanupAllPreviews();
    };
  }, [cleanupAllPreviews]);

  return {
    createPreviewUrl,
    revokePreviewUrl,
    cleanupAllPreviews,
  };
};

// Comprehensive modal lifecycle hook
export const useModalLifecycle = (isOpen: boolean) => {
  const { cleanupModal } = useModalCleanup();
  const { cleanupAllPreviews } = useImagePreviewCleanup();

  useEffect(() => {
    if (!isOpen) {
      // Cleanup when modal closes
      cleanupModal();
      cleanupAllPreviews();
    }
  }, [isOpen, cleanupModal, cleanupAllPreviews]);

  useEffect(() => {
    return () => {
      // Final cleanup on unmount
      cleanupModal();
      cleanupAllPreviews();
    };
  }, [cleanupModal, cleanupAllPreviews]);

  return {
    cleanupModal,
    cleanupAllPreviews,
  };
};
