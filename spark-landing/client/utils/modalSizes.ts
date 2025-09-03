// Standardized modal sizes for consistent UI/UX across the application

export const MODAL_SIZES = {
  // Small modals - for simple forms, confirmations, alerts
  SMALL: 'max-w-md',
  
  // Medium modals - for standard forms, details, single entity editing
  MEDIUM: 'max-w-2xl',
  
  // Large modals - for complex forms, multi-step processes, detailed views
  LARGE: 'max-w-4xl',
  
  // Extra large modals - for very complex forms, dashboards, extensive content
  XLARGE: 'max-w-6xl',
  
  // Full width modals - for maximum content display
  FULL: 'max-w-full mx-4'
} as const;

export const MODAL_HEIGHTS = {
  // Standard height - for most modals
  STANDARD: 'max-h-[85vh]',
  
  // Tall height - for content-heavy modals
  TALL: 'max-h-[90vh]',
  
  // Full height - for maximum content display
  FULL: 'max-h-[95vh]'
} as const;

// Predefined modal configurations for common use cases
export const MODAL_CONFIGS = {
  // Simple confirmation dialogs
  CONFIRMATION: {
    size: MODAL_SIZES.SMALL,
    height: MODAL_HEIGHTS.STANDARD
  },
  
  // Standard form modals
  FORM: {
    size: MODAL_SIZES.MEDIUM,
    height: MODAL_HEIGHTS.STANDARD
  },
  
  // Complex form modals
  COMPLEX_FORM: {
    size: MODAL_SIZES.LARGE,
    height: MODAL_HEIGHTS.TALL
  },
  
  // Detail view modals
  DETAIL: {
    size: MODAL_SIZES.LARGE,
    height: MODAL_HEIGHTS.STANDARD
  },
  
  // Multi-step process modals
  MULTI_STEP: {
    size: MODAL_SIZES.XLARGE,
    height: MODAL_HEIGHTS.TALL
  },
  
  // Dashboard/overview modals
  DASHBOARD: {
    size: MODAL_SIZES.XLARGE,
    height: MODAL_HEIGHTS.FULL
  }
} as const;

// Helper function to get modal classes
export const getModalClasses = (
  size: keyof typeof MODAL_SIZES | keyof typeof MODAL_CONFIGS,
  height: keyof typeof MODAL_HEIGHTS = 'STANDARD',
  additionalClasses: string = ''
): string => {
  let sizeClass: string;
  let heightClass: string;
  
  if (size in MODAL_CONFIGS) {
    const config = MODAL_CONFIGS[size as keyof typeof MODAL_CONFIGS];
    sizeClass = config.size;
    heightClass = config.height;
  } else {
    sizeClass = MODAL_SIZES[size as keyof typeof MODAL_SIZES];
    heightClass = MODAL_HEIGHTS[height];
  }
  
  const baseClasses = 'bg-white dark:bg-[#1B2030] border-gray-200 dark:border-gray-800 rounded-2xl p-0 overflow-hidden';
  
  // Ensure proper scrolling for all modals
  const scrollClasses = 'overflow-y-auto';
  
  // Add proper top margin to avoid overlapping with top navigation bar
  // Use flexbox centering and proper spacing for consistent positioning
  const positioningClasses = 'mt-8 mx-auto';
  
  return `${sizeClass} ${heightClass} ${baseClasses} ${scrollClasses} ${positioningClasses} ${additionalClasses}`.trim();
};
