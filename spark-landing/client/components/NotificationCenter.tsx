import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bell,
  X,
  MessageSquare,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  // Mock notifications data
  const mockNotifications = [
    {
      id: '1',
      type: 'reservation_confirmed',
      title: 'Reservation Confirmed! 🎉',
      message: 'Your table for 4 people on August 26th at 7:00 PM has been confirmed.',
      time: '2 hours ago',
      isRead: false,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'table_ready',
      title: 'Table Ready! 🍽️',
      message: 'Your table is now ready. Please proceed to the host stand.',
      time: '5 minutes ago',
      isRead: false,
      icon: CheckCircle,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'special_offer',
      title: 'Special Offer! 💝',
      message: 'Happy Birthday! Enjoy 20% off your meal today.',
      time: '1 day ago',
      isRead: true,
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Upcoming Reservation ⏰',
      message: 'Reminder: Your reservation is tomorrow at 7:00 PM.',
      time: '2 days ago',
      isRead: true,
      icon: AlertCircle,
      color: 'text-orange-600'
    }
  ];

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications Center
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {unreadCount} new
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {mockNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No notifications yet</h3>
              <p className="text-sm">You'll see important updates here</p>
            </div>
          ) : (
            mockNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div 
                  key={notification.id}
                  className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${notification.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Mark all as read logic would go here
              console.log('Mark all as read');
            }}
          >
            Mark all as read
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
