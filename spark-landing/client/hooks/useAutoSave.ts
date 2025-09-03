import { useState, useEffect, useCallback, useRef } from 'react';

interface AutoSaveOptions {
  key: string;
  delay?: number; // Delay in milliseconds before auto-saving
  enabled?: boolean;
  onSave?: (data: any) => void;
  onLoad?: (data: any) => void;
}

interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  autoSaveEnabled: boolean;
}

export function useAutoSave<T>(
  initialData: T,
  options: AutoSaveOptions
) {
  const {
    key,
    delay = 2000, // Default 2 second delay
    enabled = true,
    onSave,
    onLoad
  } = options;

  const [data, setData] = useState<T>(initialData);
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    autoSaveEnabled: enabled
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<T>(initialData);

  // Load data from localStorage on mount
  useEffect(() => {
    if (!enabled) return;

    try {
      const savedData = localStorage.getItem(`autosave_${key}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        lastSavedDataRef.current = parsedData;
        setAutoSaveState(prev => ({
          ...prev,
          lastSaved: new Date(),
          hasUnsavedChanges: false
        }));
        
        if (onLoad) {
          onLoad(parsedData);
        }
      }
    } catch (error) {
      console.warn('Failed to load auto-saved data:', error);
    }
  }, [key, enabled, onLoad]);

  // Auto-save function
  const saveData = useCallback(async (dataToSave: T) => {
    if (!enabled) return;

    setAutoSaveState(prev => ({ ...prev, isSaving: true }));

    try {
      // Save to localStorage
      localStorage.setItem(`autosave_${key}`, JSON.stringify(dataToSave));
      
      // Update state
      lastSavedDataRef.current = dataToSave;
      setAutoSaveState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false
      }));

      // Call custom save handler if provided
      if (onSave) {
        await onSave(dataToSave);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveState(prev => ({ ...prev, isSaving: false }));
    }
  }, [key, enabled, onSave]);

  // Debounced auto-save
  const debouncedSave = useCallback((dataToSave: T) => {
    if (!enabled) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      saveData(dataToSave);
    }, delay);
  }, [enabled, delay, saveData]);

  // Update data and trigger auto-save
  const updateData = useCallback((newData: T | ((prev: T) => T)) => {
    const updatedData = typeof newData === 'function' ? newData(data) : newData;
    
    setData(updatedData);
    setAutoSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));
    
    // Trigger auto-save
    debouncedSave(updatedData);
  }, [data, debouncedSave]);

  // Manual save
  const manualSave = useCallback(async () => {
    await saveData(data);
  }, [data, saveData]);

  // Clear auto-saved data
  const clearAutoSave = useCallback(() => {
    try {
      localStorage.removeItem(`autosave_${key}`);
      setAutoSaveState(prev => ({
        ...prev,
        lastSaved: null,
        hasUnsavedChanges: false
      }));
    } catch (error) {
      console.warn('Failed to clear auto-saved data:', error);
    }
  }, [key]);

  // Reset to initial data
  const resetData = useCallback(() => {
    setData(initialData);
    setAutoSaveState(prev => ({
      ...prev,
      hasUnsavedChanges: false
    }));
    clearAutoSave();
  }, [initialData, clearAutoSave]);

  // Toggle auto-save
  const toggleAutoSave = useCallback(() => {
    setAutoSaveState(prev => ({
      ...prev,
      autoSaveEnabled: !prev.autoSaveEnabled
    }));
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    updateData,
    autoSaveState,
    manualSave,
    clearAutoSave,
    resetData,
    toggleAutoSave
  };
}

