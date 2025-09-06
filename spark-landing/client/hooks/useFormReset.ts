import { useCallback, useRef } from 'react';

// Generic form reset hook
export const useFormReset = <T extends Record<string, any>>(
  initialState: T
) => {
  const initialStateRef = useRef(initialState);

  const resetForm = useCallback(() => {
    return { ...initialStateRef.current };
  }, []);

  const resetToNewState = useCallback((newState: T) => {
    initialStateRef.current = newState;
    return { ...newState };
  }, []);

  return {
    resetForm,
    resetToNewState,
    initialState: initialStateRef.current,
  };
};

// Specialized hooks for common form patterns
export const useModalFormReset = <T extends Record<string, any>>(
  initialState: T
) => {
  const { resetForm, resetToNewState } = useFormReset(initialState);

  const resetAndClose = useCallback(
    (onClose?: () => void) => {
      // Reset form to initial state
      resetForm();
      // Close modal if callback provided
      onClose?.();
    },
    [resetForm]
  );

  const resetWithData = useCallback(
    (data: Partial<T>, onClose?: () => void) => {
      // Merge provided data with initial state
      const newState = { ...initialState, ...data };
      resetToNewState(newState);
      onClose?.();
    },
    [resetToNewState, initialState]
  );

  return {
    resetForm,
    resetAndClose,
    resetWithData,
    initialState,
  };
};

// Hook for reservation form reset
export const useReservationFormReset = () => {
  const initialReservationState = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    partySize: '',
    reservationDate: '',
    reservationTime: '',
    tableType: '',
    specialRequests: '',
    occasion: '',
    isVIP: false,
  };

  return useModalFormReset(initialReservationState);
};

// Hook for menu item form reset
export const useMenuItemFormReset = () => {
  const initialMenuItemState = {
    name: '',
    description: '',
    price: '',
    category: '',
    customCategory: '',
    preparationTime: '',
    isAvailable: true,
    isVegetarian: false,
    isGlutenFree: false,
    calories: '',
    allergens: '',
    imageUrl: '',
    imageFile: null as File | null,
    arModelFile: null as File | null,
  };

  return useModalFormReset(initialMenuItemState);
};

// Hook for order form reset
export const useOrderFormReset = () => {
  const initialOrderState = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    tableId: null as number | null,
    orderType: 'dine-in' as 'dine-in' | 'takeout' | 'delivery',
    items: [] as Array<{
      menuItemId: string;
      quantity: number;
      specialInstructions: string;
    }>,
    specialRequests: '',
    paymentMethod: '' as string,
  };

  return useModalFormReset(initialOrderState);
};

// Hook for table form reset
export const useTableFormReset = () => {
  const initialTableState = {
    tableNumber: '',
    capacity: '',
    type: '',
    location: '',
    features: [] as string[],
    isActive: true,
    notes: '',
  };

  return useModalFormReset(initialTableState);
};

// Generic form state hook with reset functionality
export const useFormState = <T extends Record<string, any>>(
  initialState: T
) => {
  const { resetForm, resetToNewState, initialState: currentInitialState } = useFormReset(initialState);

  const getResetState = useCallback(() => {
    return resetForm();
  }, [resetForm]);

  const resetToState = useCallback(
    (newState: T) => {
      return resetToNewState(newState);
    },
    [resetToNewState]
  );

  return {
    getResetState,
    resetToState,
    currentInitialState,
  };
};

// Utility function to create form reset handlers
export const createFormResetHandler = <T extends Record<string, any>>(
  initialState: T,
  setFormData: (data: T) => void,
  additionalCleanup?: () => void
) => {
  return () => {
    setFormData({ ...initialState });
    additionalCleanup?.();
  };
};

// Utility function to create modal close handler with form reset
export const createModalCloseHandler = <T extends Record<string, any>>(
  initialState: T,
  setFormData: (data: T) => void,
  onClose: () => void,
  additionalCleanup?: () => void
) => {
  return () => {
    setFormData({ ...initialState });
    additionalCleanup?.();
    onClose();
  };
};

// Type-safe form field reset utility
export const resetFormField = <T extends Record<string, any>, K extends keyof T>(
  formData: T,
  field: K,
  defaultValue: T[K] = '' as T[K]
): T => {
  return {
    ...formData,
    [field]: defaultValue,
  };
};

// Bulk field reset utility
export const resetFormFields = <T extends Record<string, any>>(
  formData: T,
  fields: (keyof T)[],
  defaultValues?: Partial<T>
): T => {
  const newFormData = { ...formData };

  fields.forEach(field => {
    newFormData[field] = defaultValues?.[field] ?? ('' as T[keyof T]);
  });

  return newFormData;
};
