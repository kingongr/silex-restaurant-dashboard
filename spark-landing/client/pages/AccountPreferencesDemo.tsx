import React, { useState } from 'react';
import AccountPreferencesModal from '../components/modals/AccountPreferencesModal';
import { Button } from '../components/ui/button';
import { Settings } from 'lucide-react';

export default function AccountPreferencesDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Account Preferences Modal Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Click the button below to open the Account Preferences Modal
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity duration-200 shadow-lg text-lg font-semibold"
          >
            <Settings className="w-5 h-5 mr-2" />
            Open Account Preferences
          </Button>
        </div>

        <AccountPreferencesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
