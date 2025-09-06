import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface MissingInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  missingFields?: string[];
}

export default function MissingInformationModal({
  isOpen,
  onClose,
  title = "Missing Information",
  message = "Please fill in all required fields before continuing.",
  missingFields = []
}: MissingInformationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden ml-[132px]">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-orange-50/30 to-amber-50/50 dark:from-yellow-950/20 dark:via-orange-950/30 dark:to-amber-950/20 pointer-events-none" />

        <div className="relative p-6">
          {/* Header */}
          <DialogHeader className="mb-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/25">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
              {message}
            </DialogDescription>
          </DialogHeader>

          {/* Missing Fields List */}
          {missingFields.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Required fields:</h4>
              <ul className="space-y-2">
                {missingFields.map((field, index) => (
                  <li key={index} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{field}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30 transform hover:scale-[1.02] font-semibold"
            >
              <X className="w-4 h-4 mr-2" />
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
