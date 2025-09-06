import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from './button';

interface ModalErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ModalErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  modalTitle?: string;
  showRefresh?: boolean;
  showClose?: boolean;
  onClose?: () => void;
}

class ModalErrorBoundary extends Component<ModalErrorBoundaryProps, ModalErrorBoundaryState> {
  constructor(props: ModalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ModalErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Log error for debugging
    console.error('Modal Error Boundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleClose = () => {
    this.props.onClose?.();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Something went wrong
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {this.props.modalTitle ? `Error in ${this.props.modalTitle}` : 'An error occurred in this modal'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-red-600 dark:text-red-400">
                      Error Details (Development Only)
                    </summary>
                    <pre className="text-xs mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded overflow-auto max-h-32">
                      {this.state.error?.stack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                {this.props.showClose !== false && (
                  <Button
                    variant="outline"
                    onClick={this.handleClose}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Close
                  </Button>
                )}

                {this.props.showRefresh !== false && (
                  <Button
                    onClick={this.handleRefresh}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for using error boundary in functional components
export const useModalErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      console.error('Modal error handled:', error);
    }
  }, [error]);

  return {
    error,
    resetError,
    handleError,
    hasError: error !== null,
  };
};

// Higher-order component for wrapping modals with error boundary
export const withModalErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ModalErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ModalErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ModalErrorBoundary>
  );

  WrappedComponent.displayName = `withModalErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// Specialized error boundary for form modals
export const FormModalErrorBoundary: React.FC<{
  children: ReactNode;
  formName: string;
  onRetry?: () => void;
  onClose?: () => void;
}> = ({ children, formName, onRetry, onClose }) => (
  <ModalErrorBoundary
    modalTitle={`${formName} Form`}
    fallback={
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Form Error
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Something went wrong while loading the {formName.toLowerCase()} form.
            Please try again or contact support if the problem persists.
          </p>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    }
    onError={(error, errorInfo) => {
      // Log form-specific errors
      console.error(`Form error in ${formName}:`, error, errorInfo);
    }}
  >
    {children}
  </ModalErrorBoundary>
);

// Utility function to create error boundary for specific modal types
export const createModalErrorBoundary = (
  modalType: string,
  customFallback?: ReactNode
) => {
  const SpecificModalErrorBoundary: React.FC<{ children: ReactNode; onClose?: () => void }> = ({
    children,
    onClose
  }) => (
    <ModalErrorBoundary
      modalTitle={modalType}
      fallback={customFallback}
      onError={(error, errorInfo) => {
        console.error(`${modalType} modal error:`, error, errorInfo);
        // Could send to error reporting service here
      }}
      onClose={onClose}
    >
      {children}
    </ModalErrorBoundary>
  );

  return SpecificModalErrorBoundary;
};

export default ModalErrorBoundary;
