/**
 * Z-Index Hierarchy System
 *
 * This file defines a comprehensive z-index system to prevent layering conflicts
 * and ensure consistent stacking order across the application.
 *
 * Usage:
 * - Import Z_INDEX constant
 * - Use Z_INDEX.MODAL, Z_INDEX.TOOLTIP, etc.
 * - Apply via style prop or CSS custom properties
 */

// Base z-index scale with clear hierarchy
export const Z_INDEX = {
  // Base content layers
  BASE: 0,
  CONTENT: 1,

  // Interactive elements
  DROPDOWN: 1000,
  SELECT: 1000,
  POPOVER: 1050,
  TOOLTIP: 1070,

  // Navigation
  SIDEBAR: 1020,
  NAVBAR: 1030,
  BREADCRUMB: 1010,

  // Overlays
  BACKDROP: 1040,
  MODAL_BACKDROP: 1040,
  SHEET_BACKDROP: 1040,

  // Dialogs and modals
  MODAL: 1050,
  DASHBOARD_MODAL: 1050,
  SHEET: 1050,
  DIALOG: 1050,

  // Notifications
  TOAST: 1080,
  NOTIFICATION: 1080,
  ALERT: 1070,

  // Special cases
  STICKY: 1020,
  FIXED: 1030,
  FULLSCREEN: 1100,

  // Maximum safe z-index (prevents conflicts with browser extensions)
  MAX_SAFE: 9999,
} as const;

// Type for z-index values
export type ZIndexValue = typeof Z_INDEX[keyof typeof Z_INDEX];

/**
 * Helper function to get z-index with optional offset
 * Useful for stacking related elements
 */
export const getZIndex = (base: ZIndexValue, offset: number = 0): number => {
  return base + offset;
};

/**
 * CSS custom properties for z-index values
 * Can be used in CSS files or styled-components
 */
export const Z_INDEX_CSS_VARIABLES = {
  '--z-base': Z_INDEX.BASE.toString(),
  '--z-content': Z_INDEX.CONTENT.toString(),
  '--z-dropdown': Z_INDEX.DROPDOWN.toString(),
  '--z-popover': Z_INDEX.POPOVER.toString(),
  '--z-tooltip': Z_INDEX.TOOLTIP.toString(),
  '--z-sidebar': Z_INDEX.SIDEBAR.toString(),
  '--z-navbar': Z_INDEX.NAVBAR.toString(),
  '--z-backdrop': Z_INDEX.BACKDROP.toString(),
  '--z-modal': Z_INDEX.MODAL.toString(),
  '--z-toast': Z_INDEX.TOAST.toString(),
  '--z-sticky': Z_INDEX.STICKY.toString(),
  '--z-fixed': Z_INDEX.FIXED.toString(),
} as const;

/**
 * Utility function to apply z-index to a style object
 */
export const applyZIndex = (zIndex: ZIndexValue): React.CSSProperties => ({
  zIndex,
});

/**
 * Layer names for debugging and documentation
 */
export const LAYER_NAMES = {
  [Z_INDEX.BASE]: 'Base content',
  [Z_INDEX.CONTENT]: 'Content layer',
  [Z_INDEX.DROPDOWN]: 'Dropdown menus',
  [Z_INDEX.SELECT]: 'Select dropdowns',
  [Z_INDEX.POPOVER]: 'Popovers',
  [Z_INDEX.TOOLTIP]: 'Tooltips',
  [Z_INDEX.SIDEBAR]: 'Sidebar navigation',
  [Z_INDEX.NAVBAR]: 'Top navigation',
  [Z_INDEX.BACKDROP]: 'Backdrop overlays',
  [Z_INDEX.MODAL]: 'Modal dialogs',
  [Z_INDEX.TOAST]: 'Toast notifications',
  [Z_INDEX.STICKY]: 'Sticky elements',
  [Z_INDEX.FIXED]: 'Fixed elements',
} as const;
