import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { CheckCircle, X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'warning',
  isLoading = false
}: ConfirmationModalProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          gradient: 'from-green-500 to-emerald-500',
          bgGradient: 'from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-950/20 dark:via-emerald-950/30 dark:to-teal-950/20',
          shadow: 'shadow-green-500/25',
          buttonGradient: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
        };
      case 'info':
        return {
          icon: CheckCircle,
          gradient: 'from-blue-500 to-indigo-500',
          bgGradient: 'from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/30 dark:to-purple-950/20',
          shadow: 'shadow-blue-500/25',
          buttonGradient: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
        };
      default: // warning
        return {
          icon: AlertTriangle,
          gradient: 'from-yellow-500 to-orange-500',
          bgGradient: 'from-yellow-50/50 via-orange-50/30 to-amber-50/50 dark:from-yellow-950/20 dark:via-orange-950/30 dark:to-amber-950/20',
          shadow: 'shadow-yellow-500/25',
          buttonGradient: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden ml-[132px]">
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} pointer-events-none`} />

        <div className="relative p-6">
          {/* Header */}
          <DialogHeader className="mb-6 text-center">
            <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${config.shadow}`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
              {message}
            </DialogDescription>
          </DialogHeader>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="ghost"
              className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 font-medium disabled:opacity-50"
            >
              <X className="w-4 h-4 mr-2" />
              {cancelText}
            </Button>

            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-6 py-3 bg-gradient-to-r ${config.buttonGradient} text-white rounded-xl transition-all duration-200 shadow-lg ${config.shadow} hover:shadow-xl hover:shadow-yellow-500/30 transform hover:scale-[1.02] font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {confirmText}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
