import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Modal types for type safety
export type ModalType =
  | 'bookTable'
  | 'reservationDetail'
  | 'editReservation'
  | 'cancelReservation'
  | 'addMenuItem'
  | 'editMenuItem'
  | 'addOrder'
  | 'editOrder'
  | 'addTable'
  | 'editTable'
  | 'confirmation'
  | 'error'
  | 'missingInfo'
  | null;

// Modal data interface for passing data to modals
export interface ModalData {
  reservation?: any;
  order?: any;
  menuItem?: any;
  table?: any;
  confirmation?: {
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
  };
  error?: {
    title: string;
    message: string;
  };
  [key: string]: any;
}

// Modal context interface
interface ModalContextType {
  activeModal: ModalType;
  modalData: ModalData | null;
  isModalOpen: boolean;

  // Actions
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  updateModalData: (data: Partial<ModalData>) => void;
}

// Create context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Custom hook to use modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Modal provider component
interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  // Open modal with optional data
  const openModal = useCallback((type: ModalType, data?: ModalData) => {
    setActiveModal(type);
    setModalData(data || null);
  }, []);

  // Close modal and clear data
  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  // Update modal data without changing modal type
  const updateModalData = useCallback((data: Partial<ModalData>) => {
    setModalData(prev => prev ? { ...prev, ...data } : data);
  }, []);

  // Computed value for whether any modal is open
  const isModalOpen = activeModal !== null;

  const value: ModalContextType = {
    activeModal,
    modalData,
    isModalOpen,
    openModal,
    closeModal,
    updateModalData,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

// Helper hooks for specific modal types
export const useReservationModals = () => {
  const { openModal, closeModal, activeModal, modalData } = useModal();

  return {
    // Book table modal
    openBookTable: (data?: ModalData) => openModal('bookTable', data),
    isBookTableOpen: activeModal === 'bookTable',

    // Reservation detail modal
    openReservationDetail: (reservation: any) => openModal('reservationDetail', { reservation }),
    isReservationDetailOpen: activeModal === 'reservationDetail',
    reservationData: modalData?.reservation,

    // Edit reservation modal
    openEditReservation: (reservation: any) => openModal('editReservation', { reservation }),
    isEditReservationOpen: activeModal === 'editReservation',
    editReservationData: modalData?.reservation,

    // Cancel reservation modal
    openCancelReservation: (reservation: any) => openModal('cancelReservation', { reservation }),
    isCancelReservationOpen: activeModal === 'cancelReservation',
    cancelReservationData: modalData?.reservation,

    closeModal,
  };
};

export const useOrderModals = () => {
  const { openModal, closeModal, activeModal, modalData } = useModal();

  return {
    // Add order modal
    openAddOrder: (data?: ModalData) => openModal('addOrder', data),
    isAddOrderOpen: activeModal === 'addOrder',

    // Edit order modal
    openEditOrder: (order: any) => openModal('editOrder', { order }),
    isEditOrderOpen: activeModal === 'editOrder',
    editOrderData: modalData?.order,

    closeModal,
  };
};

export const useMenuModals = () => {
  const { openModal, closeModal, activeModal, modalData } = useModal();

  return {
    // Add menu item modal
    openAddMenuItem: (data?: ModalData) => openModal('addMenuItem', data),
    isAddMenuItemOpen: activeModal === 'addMenuItem',

    // Edit menu item modal
    openEditMenuItem: (menuItem: any) => openModal('editMenuItem', { menuItem }),
    isEditMenuItemOpen: activeModal === 'editMenuItem',
    editMenuItemData: modalData?.menuItem,

    closeModal,
  };
};

export const useTableModals = () => {
  const { openModal, closeModal, activeModal, modalData } = useModal();

  return {
    // Add table modal
    openAddTable: (data?: ModalData) => openModal('addTable', data),
    isAddTableOpen: activeModal === 'addTable',

    // Edit table modal
    openEditTable: (table: any) => openModal('editTable', { table }),
    isEditTableOpen: activeModal === 'editTable',
    editTableData: modalData?.table,

    closeModal,
  };
};

export const useConfirmationModal = () => {
  const { openModal, closeModal, activeModal, modalData } = useModal();

  return {
    openConfirmation: (confirmationData: NonNullable<ModalData['confirmation']>) =>
      openModal('confirmation', { confirmation: confirmationData }),
    isConfirmationOpen: activeModal === 'confirmation',
    confirmationData: modalData?.confirmation,
    closeModal,
  };
};

export const useErrorModal = () => {
  const { openModal, closeModal, activeModal, modalData } = useModal();

  return {
    openError: (errorData: NonNullable<ModalData['error']>) =>
      openModal('error', { error: errorData }),
    isErrorOpen: activeModal === 'error',
    errorData: modalData?.error,
    closeModal,
  };
};

export const useMissingInfoModal = () => {
  const { openModal, closeModal, activeModal } = useModal();

  return {
    openMissingInfo: (data?: ModalData) => openModal('missingInfo', data),
    isMissingInfoOpen: activeModal === 'missingInfo',
    closeModal,
  };
};

// Default export
export default ModalProvider;
