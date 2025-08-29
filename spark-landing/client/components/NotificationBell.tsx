import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NotificationCenter from './NotificationCenter';

export default function NotificationBell() {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  
  const handleBellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotificationCenterOpen(true);
  };
  
  const handleCloseNotificationCenter = () => {
    setIsNotificationCenterOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={handleBellClick}
          onMouseDown={(e) => e.preventDefault()}
          className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 border-2 border-transparent hover:border-blue-500 rounded-lg"
          style={{ 
            background: isNotificationCenterOpen ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            transform: isNotificationCenterOpen ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.2s ease'
          }}
        >
          <Bell className="w-5 h-5" />
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0"
          >
            3
          </Badge>
        </button>
      </div>
      
      <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={handleCloseNotificationCenter}
      />
    </>
  );
}
