import React, { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { DashboardDialog, DashboardDialogContent, DashboardDialogHeader, DashboardDialogTitle, DashboardDialogDescription } from '../ui/dashboard-dialog';
import { Button } from '../ui/button';
import { ModalErrorBoundary, FormModalErrorBoundary } from '../ui/ModalErrorBoundary';
import { useModal, ModalType } from '../../contexts/ModalContext';
import { useFormReset } from '../../hooks/useFormReset';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useModalCleanup } from '../../hooks/useModalCleanup';
import { CheckCircle, AlertTriangle, Info, X, Loader2 } from 'lucide-react';

// Base modal configuration
export interface ModalConfig {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'dashboard';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  autoFocus?: boolean;
}

// Form modal configuration
export interface FormModalConfig extends ModalConfig {
  formName: string;
  initialData?: Record<string, any>;
  validationSchema?: any;
  submitButtonText?: string;
  cancelButtonText?: string;
  showResetButton?: boolean;
}

// Confirmation modal configuration
export interface ConfirmationModalConfig extends ModalConfig {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

// Composable Modal Component
interface BaseModalProps extends ModalConfig {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  variant = 'default',
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  preventScroll = true,
  autoFocus = true,
}) => {
  const { modalRef } = useAccessibility().useModalFocus(isOpen, autoFocus);
  const { cleanupModal } = useModalCleanup().useModalLifecycle(isOpen);

  const handleClose = () => {
    cleanupModal();
    onClose();
  };

  const modalProps = {
    open: isOpen,
    onOpenChange: closeOnBackdropClick ? handleClose : undefined,
  };

  const contentProps = {
    className: size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-2xl' : size === 'xl' ? 'max-w-4xl' : size === 'full' ? 'max-w-full' : 'max-w-lg',
    ref: modalRef,
  };

  if (variant === 'dashboard') {
    return (
      <DashboardDialog {...modalProps}>
        <DashboardDialogContent {...contentProps}>
          {(title || description) && (
            <DashboardDialogHeader>
              {title && <DashboardDialogTitle>{title}</DashboardDialogTitle>}
              {description && <DashboardDialogDescription>{description}</DashboardDialogDescription>}
            </DashboardDialogHeader>
          )}
          <div className="flex-1">
            {children}
          </div>
          {footer && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              {footer}
            </div>
          )}
        </DashboardDialogContent>
      </DashboardDialog>
    );
  }

  return (
    <Dialog {...modalProps}>
      <DialogContent {...contentProps}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className="flex-1">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Form Modal Component
interface FormModalProps extends FormModalConfig {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  children: (formData: Record<string, any>, setFormData: (data: Record<string, any>) => void) => ReactNode;
  title?: string;
  description?: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  children,
  title,
  description,
  formName,
  initialData = {},
  submitButtonText = 'Save',
  cancelButtonText = 'Cancel',
  showResetButton = false,
  ...modalConfig
}) => {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { resetForm } = useFormReset(initialData);
  const { announceSubmissionStart, announceSubmissionSuccess, announceSubmissionError } = useAccessibility().useFormSubmission();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      announceSubmissionStart(formName);

      await onSubmit(formData);

      announceSubmissionSuccess(formName);
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setErrors({ submit: errorMessage });
      announceSubmissionError(formName, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(initialData);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleReset = () => {
    setFormData(resetForm());
    setErrors({});
  };

  const footer = (
    <>
      {showResetButton && (
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Reset
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={handleClose}
        disabled={isSubmitting}
      >
        {cancelButtonText}
      </Button>
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="min-w-[100px]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </>
  );

  return (
    <FormModalErrorBoundary
      formName={formName}
      onRetry={() => window.location.reload()}
      onClose={handleClose}
    >
      <BaseModal
        {...modalConfig}
        isOpen={isOpen}
        onClose={handleClose}
        title={title}
        description={description}
        footer={footer}
      >
        {children(formData, setFormData)}

        {errors.submit && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}
      </BaseModal>
    </FormModalErrorBoundary>
  );
};

// Confirmation Modal Component
interface ConfirmationModalProps extends ConfirmationModalConfig {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancelButton = true,
  ...modalConfig
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          gradient: 'from-green-500 to-emerald-500',
          bgGradient: 'from-green-50/50 via-emerald-50/30 to-teal-50/50',
          confirmButtonClass: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600',
        };
      case 'error':
        return {
          icon: AlertTriangle,
          gradient: 'from-red-500 to-pink-500',
          bgGradient: 'from-red-50/50 via-pink-50/30 to-rose-50/50',
          confirmButtonClass: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
        };
      case 'info':
        return {
          icon: Info,
          gradient: 'from-blue-500 to-indigo-500',
          bgGradient: 'from-blue-50/50 via-indigo-50/30 to-purple-50/50',
          confirmButtonClass: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
        };
      default: // warning
        return {
          icon: AlertTriangle,
          gradient: 'from-yellow-500 to-orange-500',
          bgGradient: 'from-yellow-50/50 via-orange-50/30 to-amber-50/50',
          confirmButtonClass: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const footer = (
    <>
      {showCancelButton && (
        <Button
          onClick={onClose}
          disabled={isConfirming}
          variant="outline"
        >
          <X className="w-4 h-4 mr-2" />
          {cancelText}
        </Button>
      )}
      <Button
        onClick={handleConfirm}
        disabled={isConfirming}
        className={config.confirmButtonClass}
      >
        {isConfirming ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Icon className="w-4 h-4 mr-2" />
            {confirmText}
          </>
        )}
      </Button>
    </>
  );

  return (
    <ModalErrorBoundary
      modalTitle="Confirmation"
      onClose={onClose}
    >
      <BaseModal
        {...modalConfig}
        isOpen={isOpen}
        onClose={onClose}
        footer={footer}
        size="sm"
      >
        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
      </BaseModal>
    </ModalErrorBoundary>
  );
};

// Loading Modal Component
interface LoadingModalProps extends ModalConfig {
  isOpen: boolean;
  title?: string;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  title = 'Loading...',
  message = 'Please wait while we process your request.',
  ...modalConfig
}) => (
  <BaseModal
    {...modalConfig}
    isOpen={isOpen}
    onClose={() => {}} // Disable close for loading modals
    showCloseButton={false}
    size="sm"
  >
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  </BaseModal>
);

// Error Modal Component
interface ErrorModalProps extends ModalConfig {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  ...modalConfig
}) => {
  const footer = (
    <>
      <Button onClick={onClose} variant="outline">
        Close
      </Button>
      {onRetry && (
        <Button onClick={onRetry}>
          Try Again
        </Button>
      )}
    </>
  );

  return (
    <BaseModal
      {...modalConfig}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
    </BaseModal>
  );
};

// Modal Manager Hook
export const useModalManager = () => {
  const { openModal, closeModal, activeModal, modalData } = useModal();

  const showFormModal = (type: ModalType, config: FormModalConfig) => {
    openModal(type, { modalConfig: config });
  };

  const showConfirmationModal = (config: ConfirmationModalConfig) => {
    openModal('confirmation', { confirmation: config });
  };

  const showErrorModal = (config: Omit<ErrorModalProps, 'isOpen' | 'onClose'>) => {
    openModal('error', { error: config });
  };

  return {
    activeModal,
    modalData,
    showFormModal,
    showConfirmationModal,
    showErrorModal,
    closeModal,
  };
};

// Export all modal patterns
export default {
  BaseModal,
  FormModal,
  ConfirmationModal,
  LoadingModal,
  ErrorModal,
  useModalManager,
};
